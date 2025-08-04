import axios from 'axios';
import toast from 'react-hot-toast';

// Types
export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface Project {
  id: number;
  name: string;
  color: string;
  userId: number;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  projectId: number;
  project?: {
    id: number;
    name: string;
    color: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  totalProjects: number;
  tasksByProject: Array<{
    name: string;
    color: string;
    taskCount: number;
  }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/auth/')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    
    // Only show toast for non-401 errors to avoid spam
    if (error.response?.status !== 401) {
      const message = error.response?.data?.error || 'An error occurred';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  create: async (name: string, color: string = '#3B82F6'): Promise<Project> => {
    const response = await api.post('/projects', { name, color });
    return response.data;
  },

  update: async (id: number, data: { name?: string; color?: string }): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (filters?: { projectId?: number; filter?: 'all' | 'active' | 'completed' }): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId.toString());
    if (filters?.filter) params.append('filter', filters.filter);
    
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    projectId: number;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
  }): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: number, data: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
  }): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

// Utility functions
export const auth = {
  getToken: () => localStorage.getItem('token'),
  getUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setAuth: (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Basic token validation (you could add JWT decode here)
    return token.length > 10; // Simple check that token exists and has some length
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};