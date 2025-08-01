# Task Manager - Full Stack Application

A modern, full-stack task management application built with Next.js, Express.js, Prisma, and PostgreSQL. Features a beautiful UI with drag-and-drop functionality, real-time statistics, and comprehensive project management.

## 🚀 Features

### ✅ Core Features
- **User Authentication**: Secure sign up/login with JWT tokens
- **Project Management**: Create, edit, and organize projects with custom colors
- **Task Management**: Create, edit, complete, and delete tasks
- **Priority System**: Set task priorities (Low, Medium, High, Urgent)
- **Due Dates**: Set and track task deadlines with overdue notifications
- **Task Filtering**: Filter tasks by status (All, Active, Completed)
- **Drag & Drop**: Reorder tasks with beautiful drag-and-drop interface

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Track total tasks, completed tasks, and active tasks
- **Project Overview**: Visual charts showing task distribution by project
- **Progress Tracking**: Overall completion percentage with progress bars
- **Beautiful Charts**: Interactive charts using Chart.js

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Clean, modern interface with smooth transitions
- **Real-time Updates**: Instant feedback with toast notifications
- **Beautiful Animations**: Smooth hover effects and transitions

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Beautiful DnD** - Drag and drop functionality
- **Chart.js** - Data visualization
- **React Hot Toast** - Toast notifications
- **Heroicons** - Beautiful icons

### Backend
- **Express.js** - Node.js web framework
- **Prisma** - Modern database ORM
- **PostgreSQL** - Robust relational database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database
- **Neon** - Serverless PostgreSQL (recommended for production)

## 📁 Project Structure

```
task-manager/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── server.js       # Main server file
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & validation middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── dev.db         # SQLite database (development)
│   └── package.json
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── services/      # API service functions
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript type definitions
│   └── package.json
└── task-manager-mobile/   # React Native mobile app (WIP)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Neon for production)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-manager
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Set up database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: http://localhost:5555 (run `npm run db:studio`)

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## 📊 Database Schema

### Users
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - User's full name
- `createdAt` - Account creation timestamp

### Projects
- `id` - Primary key
- `name` - Project name
- `color` - Custom color for project
- `userId` - Foreign key to user
- `createdAt` - Project creation timestamp

### Tasks
- `id` - Primary key
- `title` - Task title
- `description` - Optional task description
- `completed` - Completion status
- `priority` - Priority level (LOW, MEDIUM, HIGH, URGENT)
- `dueDate` - Optional due date
- `projectId` - Foreign key to project
- `createdAt` - Task creation timestamp

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get tasks (with filters)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy with `npm start`

### Frontend Deployment (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## 🔮 Future Enhancements

- [ ] **Mobile App**: React Native mobile application
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Team Collaboration**: Multi-user project sharing
- [ ] **File Attachments**: Upload files to tasks
- [ ] **Email Notifications**: Due date reminders
- [ ] **Calendar Integration**: Sync with Google Calendar
- [ ] **Advanced Analytics**: Time tracking and productivity insights
- [ ] **API Documentation**: Swagger/OpenAPI docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Chart.js](https://chartjs.org/) - Data visualization
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) - Drag and drop

---

**Built with ❤️ using modern web technologies** 