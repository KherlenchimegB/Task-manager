// User types
export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  taskCount?: {
    total: number;
    completed: number;
    pending: number;
  };
}

// Task types
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  project?: {
    name: string;
    color: string;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  todayTasks: number;
  completionRate: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name?: string;
}

export interface ProjectForm {
  name: string;
  description?: string;
  color?: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}
