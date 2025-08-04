import axios from "axios";
import Cookies from "js-cookie";
import {
  User,
  Project,
  Task,
  AuthResponse,
  DashboardStats,
  LoginForm,
  RegisterForm,
  ProjectForm,
  TaskForm,
} from "../types";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("auth-token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  // User registration
  register: async (userData: RegisterForm): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // User login
  login: async (credentials: LoginForm): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

// Projects API
export const projectsApi = {
  // Get all user projects
  getAll: async (): Promise<{ projects: Project[] }> => {
    const response = await api.get("/projects");
    return response.data;
  },

  // Get single project with tasks
  getById: async (
    id: number
  ): Promise<{ project: Project & { tasks: Task[] } }> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  create: async (
    projectData: ProjectForm
  ): Promise<{ project: Project; message: string }> => {
    const response = await api.post("/projects", projectData);
    return response.data;
  },

  // Update project
  update: async (
    id: number,
    projectData: Partial<ProjectForm>
  ): Promise<{ project: Project; message: string }> => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Tasks API
export const tasksApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<{
    stats: DashboardStats;
    recentTasks: Task[];
  }> => {
    const response = await api.get("/tasks/dashboard");
    return response.data;
  },

  // Get tasks for a project
  getByProject: async (
    projectId: number,
    filter?: "all" | "active" | "completed"
  ): Promise<{ tasks: Task[] }> => {
    const params = filter ? { filter } : {};
    const response = await api.get(`/tasks/project/${projectId}`, { params });
    return response.data;
  },

  // Create new task
  create: async (
    projectId: number,
    taskData: TaskForm
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.post(`/tasks/project/${projectId}`, taskData);
    return response.data;
  },

  // Update task
  update: async (
    id: number,
    taskData: Partial<TaskForm>
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Toggle task completion
  toggle: async (id: number): Promise<{ task: Task; message: string }> => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  // Delete task
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
