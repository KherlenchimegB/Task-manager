# Task Manager

A full-stack task management application built with Next.js, Express, and Prisma.

## Features

- 🔐 User authentication with JWT
- 📊 Dashboard with statistics
- 📁 Project management
- ✅ Task creation and management
- 🎨 Priority levels and due dates
- 📱 Responsive design
- 🔄 Real-time updates

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js framework
- **Prisma** - Database ORM
- **SQLite** - Database (development)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Validation

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   ```bash
   npm run db:setup
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend (port 5000) and frontend (port 3000) servers.

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Project Structure

```
task-manager/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth & validation
│   │   ├── routes/          # API routes
│   │   ├── utils/           # JWT utilities
│   │   └── server.js        # Main server file
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── lib/            # API client & auth
│   │   └── types/          # TypeScript types
│   └── package.json
└── package.json            # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/dashboard` - Get dashboard stats
- `GET /api/tasks/project/:projectId` - Get project tasks
- `POST /api/tasks/project/:projectId` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task

## Database Schema

### Users
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - Optional full name
- `createdAt` - Account creation date
- `updatedAt` - Last update date

### Projects
- `id` - Primary key
- `name` - Project name
- `description` - Optional description
- `color` - Project color for UI
- `userId` - Foreign key to User
- `createdAt` - Creation date
- `updatedAt` - Last update date

### Tasks
- `id` - Primary key
- `title` - Task title
- `description` - Optional description
- `completed` - Completion status
- `priority` - low/medium/high
- `dueDate` - Optional due date
- `projectId` - Foreign key to Project
- `createdAt` - Creation date
- `updatedAt` - Last update date

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Database
npm run db:setup         # Generate Prisma client and push schema
npm run db:reset         # Reset database schema

# Build
npm run build           # Build frontend for production
npm run start           # Start production backend server
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## Features in Detail

### Authentication
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Automatic token refresh
- Protected routes

### Dashboard
- Overview statistics
- Recent tasks
- Project summaries
- Completion rates

### Project Management
- Create and organize projects
- Color-coded projects
- Task counts and progress
- Project descriptions

### Task Management
- Create tasks with priorities
- Set due dates
- Mark tasks as complete
- Filter by status
- Priority indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 