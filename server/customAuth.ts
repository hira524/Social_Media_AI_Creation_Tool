import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import MongoStore from "connect-mongo";
import { storage } from "./storage";
import { signupSchema, loginSchema } from "@shared/validation";

// Development mode flag
const isDevelopment = process.env.NODE_ENV === "development";

if (!process.env.AUTH_DOMAINS && !isDevelopment) {
  throw new Error("Environment variable AUTH_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    // Skip OIDC discovery for now - authentication disabled
    return null;
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // For development, use a simple in-memory session store
  if (isDevelopment) {
    return session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false, // Don't save uninitialized sessions
      cookie: {
        httpOnly: true,
        secure: false, // Allow non-secure cookies in development
        maxAge: sessionTtl,
        sameSite: 'lax', // Allow same-site requests
      },
      // Use default MemoryStore for development
    });
  }

  // Production MongoDB session store
  const sessionStore = MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    ttl: Math.floor(sessionTtl / 1000), // TTL in seconds
    collectionName: "sessions",
    touchAfter: 24 * 3600 // lazy session update
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: !isDevelopment, // Allow non-secure cookies in development
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  // Authentication is simplified - no OIDC for now
  if (!config) {
    console.log("Authentication: Using simplified auth (no OIDC configured)");
    
    // Set up simple authentication
    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));

    // POST route for user signup
    app.post("/api/signup", async (req, res) => {
      try {
        const validatedData = signupSchema.parse(req.body);
        
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(validatedData.email);
        if (existingUser) {
          return res.status(400).json({ message: "User already exists with this email" });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
        
        // Create new user
        const userId = uuidv4();
        const newUser = await storage.createUser({
          id: userId,
          email: validatedData.email,
          password: hashedPassword,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          profileImageUrl: "",
          onboardingCompleted: false,
          creditsRemaining: 5
        });
        
        // Create session
        const userSession = {
          claims: {
            sub: newUser.id,
            email: newUser.email,
            first_name: newUser.firstName,
            last_name: newUser.lastName
          },
          access_token: `token-${userId}`,
          expires_at: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
        };

        req.login(userSession, (err) => {
          if (err) {
            console.error("Signup login error:", err);
            return res.status(500).json({ message: "Signup failed" });
          }
          
          return res.json({ 
            success: true, 
            message: "Account created successfully", 
            user: {
              id: newUser.id,
              email: newUser.email,
              firstName: newUser.firstName,
              lastName: newUser.lastName
            },
            redirect: "/onboarding"
          });
        });
        
      } catch (error) {
        console.error("Signup error:", error);
        if (error instanceof Error && 'issues' in error) {
          return res.status(400).json({ message: "Invalid signup data", errors: error.issues });
        }
        return res.status(500).json({ message: "Signup failed" });
      }
    });

    // POST route for user login
    app.post("/api/login", async (req, res) => {
      try {
        const validatedData = loginSchema.parse(req.body);
        
        // Find user by email
        const user = await storage.getUserByEmail(validatedData.email);
        if (!user || !user.password) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Create session
        const userSession = {
          claims: {
            sub: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName
          },
          access_token: `token-${user.id}`,
          expires_at: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
        };

        req.login(userSession, (err) => {
          if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Login failed" });
          }
          
          return res.json({ 
            success: true, 
            message: "Login successful", 
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            },
            redirect: "/dashboard"
          });
        });
        
      } catch (error) {
        console.error("Login error:", error);
        if (error instanceof Error && 'issues' in error) {
          return res.status(400).json({ message: "Invalid login data", errors: error.issues });
        }
        return res.status(500).json({ message: "Login failed" });
      }
    });

    app.get("/api/callback", (req, res) => {
      res.redirect("/");
    });

    app.get("/api/logout", (req, res) => {
      req.logout((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        
        // Always return JSON response for API calls
        res.json({ 
          success: true, 
          message: "Logout successful",
          redirect: "/"
        });
      });
    });

    return;
  }

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .AUTH_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `customauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`customauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`customauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.APP_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  console.log("IsAuthenticated check - Session ID:", req.sessionID);
  console.log("IsAuthenticated check - User:", req.user);
  console.log("IsAuthenticated check - isAuthenticated():", req.isAuthenticated());
  
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  return next();
};
