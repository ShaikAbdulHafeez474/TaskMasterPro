# Task Management System

A comprehensive task management system built with modern web technologies, enabling users to organize, track, and optimize their daily productivity.

## Features
- Task management with priority levels
- Team collaboration
- Calendar view
- Analytics dashboard
- Authentication system

## Prerequisites
- Node.js v20+
- PostgreSQL database

## Setup Instructions

1. **Clone the Repository**
```bash
git clone <repository-url>
cd task-management-system
```

2. **Install Dependencies**
```bash
npm install
```

3. **Database Setup**
- Create a PostgreSQL database
- Set up your environment variables in a `.env` file:
```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```

4. **Push Database Schema**
```bash
npm run db:push
```

5. **Start the Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure
- `/client` - Frontend React application
- `/server` - Express.js backend
- `/shared` - Shared types and schemas

## Technologies Used
- Next.js 15 with App Router
- PostgreSQL with Drizzle ORM
- TypeScript
- React Query
- Tailwind CSS
- Express.js
- Authentication with Passport.js
