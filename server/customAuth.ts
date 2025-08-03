import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import MongoStore from "connect-mongo";
import { storage } from "./storage";

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

    // Ensure the default user exists in the database on startup
    await storage.upsertUser({
      id: "default-user-123",
      email: "user@example.com",
      firstName: "Default",
      lastName: "User",
      profileImageUrl: "",
    });

    app.get("/api/login", (req, res) => {
      // Manual login - create session only when explicitly requested
      const defaultUser = {
        claims: {
          sub: "default-user-123",
          email: "user@example.com",
          first_name: "Default",
          last_name: "User"
        },
        access_token: "default-access-token",
        expires_at: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
      };

      console.log("Login attempt - creating session...");
      req.login(defaultUser, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        console.log("Login successful - session created");
        console.log("Session ID:", req.sessionID);
        console.log("User object:", req.user);
        
        // For development, return JSON response instead of redirect to handle CORS better
        if (process.env.NODE_ENV === "development") {
          return res.json({ 
            success: true, 
            message: "Login successful", 
            user: defaultUser,
            redirect: "/dashboard"
          });
        } else {
          res.redirect("/dashboard");
        }
      });
    });

    app.get("/api/signup", (req, res) => {
      // For now, signup does the same as login since we're using a default user
      // In the future, this would create a new user account
      const defaultUser = {
        claims: {
          sub: "default-user-123",
          email: "user@example.com",
          first_name: "Default",
          last_name: "User"
        },
        access_token: "default-access-token",
        expires_at: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
      };

      req.login(defaultUser, (err) => {
        if (err) {
          console.error("Signup error:", err);
          return res.status(500).json({ message: "Signup failed" });
        }
        
        // For development, return JSON response instead of redirect
        if (process.env.NODE_ENV === "development") {
          return res.json({ 
            success: true, 
            message: "Signup successful", 
            user: defaultUser,
            redirect: "/onboarding"
          });
        } else {
          res.redirect("/onboarding");
        }
      });
    });

    app.get("/api/callback", (req, res) => {
      res.redirect("/");
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        // In development, redirect to the Vite dev server
        if (process.env.NODE_ENV === "development") {
          res.redirect("http://localhost:3000/");
        } else {
          res.redirect("/");
        }
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
