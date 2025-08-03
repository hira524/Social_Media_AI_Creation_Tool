# Social Media AI Creation Tool

A full-stack SaaS web application for AI-powered social media image generation using the MERN stack (MongoDB, Express, React, Node.js).

## Features

- AI-powered social media image generation
- User authentication and authorization
- Dashboard for managing generated content
- MongoDB integration for data persistence
- Modern React UI with Tailwind CSS and shadcn/ui components

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/hira524/Social_Media_AI_Creation_Tool.git
cd Social_Media_AI_Creation_Tool
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual configuration:
   - **DATABASE_URL**: Your MongoDB connection string
   - **OPENAI_API_KEY**: Your OpenAI API key
   - **SESSION_SECRET**: A secure random string for session management
   - **Other settings**: Update according to your setup

### 4. Database Setup

```bash
npm run db:push
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **AI Integration**: OpenAI API
- **Authentication**: Custom auth with MongoDB sessions
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives with shadcn/ui

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/               # Express backend
├── shared/               # Shared types and schemas
└── ...config files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## Security Note

Never commit sensitive information like API keys or database credentials to the repository. Always use environment variables and ensure your `.env` file is listed in `.gitignore`.
