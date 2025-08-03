# AI Creator Studio - Full-Stack SaaS Web Application

## Overview

AI Creator Studio is a full-stack SaaS web application built for generating AI-powered social media images. The application allows users to create professional social media content optimized for different platforms (Instagram, LinkedIn, Twitter) using AI image generation. The system includes user authentication, personalized onboarding, and a comprehensive image generation workflow with history tracking.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Custom design system built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom Auth with OpenID Connect integration
- **AI Integration**: OpenAI API for image generation (DALL-E 3) and prompt enhancement (GPT-4)
- **Session Management**: Express sessions stored in MongoDB

### Database Design
The application uses MongoDB with the following key collections:
- `users`: Stores user profiles, onboarding data, and credit system
- `generated_images`: Tracks all generated images with metadata
- `sessions`: Handles user authentication sessions (required for Custom Auth)

## Key Components

### Authentication System
- **Provider**: Custom Auth with OpenID Connect
- **Session Storage**: MongoDB-based session store using connect-mongo
- **User Management**: Automatic user creation/updates on login
- **Security**: JWT-based authentication with secure HTTP-only cookies

### Onboarding Flow
- **Purpose**: Personalizes AI image generation based on user preferences
- **Data Collected**: 
  - User niche (fitness, food, tech, fashion, business, travel)
  - Content type (quotes, promotions, educational, announcements)
  - Style preference (professional, creative, minimalist, bold)
- **Implementation**: Multi-step form with validation, stored in user profile

### AI Image Generation
- **Primary Service**: OpenAI DALL-E 3 for image generation
- **Enhancement**: GPT-4 for prompt optimization based on user preferences
- **Platform Optimization**: Different dimensions and styles for Instagram, LinkedIn, Twitter
- **Quality**: Standard quality 1024x1024 images with platform-specific adaptations

### Credit System
- **Initial Credits**: 5 credits per new user
- **Usage**: 1 credit per image generation
- **Tracking**: Real-time credit balance display and validation

### Image Management
- **History**: Complete generation history with favorites system
- **Metadata**: Stores original prompt, enhanced prompt, platform, style, and dimensions
- **Actions**: Download, favorite/unfavorite, view full resolution

## Data Flow

1. **User Registration/Login**: Handled by Custom Auth, creates/updates user record
2. **Onboarding**: Collects user preferences and stores in database
3. **Image Generation Request**: 
   - User submits prompt and selects platform/style
   - System enhances prompt using user preferences via GPT-4
   - Enhanced prompt sent to DALL-E 3 for image generation
   - Result stored in database with metadata
   - User credits decremented
4. **Image History**: Retrieved from database with user-specific filtering
5. **Favorites Management**: Toggle favorite status with optimistic updates

## External Dependencies

### Core Dependencies
- **Database**: MongoDB (cloud or self-hosted)
- **AI Services**: OpenAI API (DALL-E 3 + GPT-4)
- **Authentication**: Custom Auth service
- **UI Components**: Radix UI primitives
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS with class-variance-authority

### Development Tools
- **Build Tool**: Vite with React plugin
- **Database ODM**: Mongoose for MongoDB
- **TypeScript**: Full type safety across frontend and backend
- **Development**: tsx for TypeScript execution

## Deployment Strategy

### Development Environment
- **Server**: Development server runs on tsx with hot reloading
- **Database**: Connected to MongoDB via DATABASE_URL
- **Environment Variables**: 
  - `DATABASE_URL`: MongoDB connection string
  - `OPENAI_API_KEY`: OpenAI API authentication
  - `SESSION_SECRET`: Session encryption key
  - `APP_ID`: Application identifier

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: MongoDB collections created automatically via Mongoose
- **Deployment**: Single Node.js process serving both API and static files

### Architecture Decisions

1. **Monorepo Structure**: Simplified deployment and shared TypeScript types
2. **Custom Auth**: Flexible authentication system with OpenID Connect
3. **MongoDB + Mongoose**: Document-based database with strong schema validation
4. **OpenAI Integration**: Industry-leading image generation quality
5. **Credit System**: Simple usage tracking and monetization foundation
6. **Shared Schema**: Common types between frontend and backend for consistency

The application follows a traditional full-stack architecture with modern tooling, prioritizing developer experience, type safety, and user experience.