# Social Media AI Creation Tool - Setup Guide

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- OpenAI API key

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SESSION_SECRET`: A random secret for session security

3. **Database Setup**

   ```bash
   npm run db:push
   ```

4. **Development**

   ```bash
   npm run dev
   ```

   The application will be available at <http://localhost:5000>

5. **Production Build**

   ```bash
   npm run build
   npm start
   ```

## Project Structure

- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and schemas
- `components.json` - shadcn/ui configuration

## Features

- AI-powered social media image generation
- Support for Instagram, LinkedIn, and Twitter formats
- User authentication and onboarding
- Image history and favorites
- Credit system

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, Drizzle ORM
- **Database**: PostgreSQL (via Neon)
- **AI**: OpenAI DALL-E 3
- **Authentication**: Custom Auth (configurable)
