'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, dashboardAPI, projectsAPI, tasksAPI } from '@/services/api';
import type { DashboardStats, Project, Task } from '@/services/api';
import ProjectSidebar from '@/components/ProjectSidebar';
import TaskList from '@/components/TaskList';
import { PlusIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, projectsData] = await Promise.all([
        dashboardAPI.getStats(),
        projectsAPI.getAll()
      ]);
      
      setStats(statsData);
      setProjects(projectsData);
      
      // Set first project as selected by default
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0]);
      }
      
      await loadTasks();
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        auth.clearAuth();
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const tasksData = await tasksAPI.getAll({
        projectId: selectedProject?.id,
        filter
      });
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      loadTasks();
    }
  }, [selectedProject, filter]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setSidebarOpen(false);
  };

  const handleProjectCreate = async (name: string, color: string) => {
    try {
      const newProject = await projectsAPI.create(name, color);
      setProjects(prev => [...prev, newProject]);
      setSelectedProject(newProject);
      toast.success('Project created successfully!');
      await loadData(); // Refresh stats
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleProjectUpdate = async (id: number, data: { name?: string; color?: string }) => {
    try {
      await projectsAPI.update(id, data);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      if (selectedProject?.id === id) {
        setSelectedProject(prev => prev ? { ...prev, ...data } : null);
      }
      toast.success('Project updated successfully!');
      await loadData(); // Refresh stats
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleProjectDelete = async (id: number) => {
    try {
      await projectsAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      
      // If deleted project was selected, select first remaining project
      if (selectedProject?.id === id) {
        const remainingProjects = projects.filter(p => p.id !== id);
        setSelectedProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
      }
      
      toast.success('Project deleted successfully!');
      await loadData(); // Refresh stats
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleTaskCreate = async (taskData: {
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
  }) => {
    if (!selectedProject) return;
    
    try {
      await tasksAPI.create({
        ...taskData,
        projectId: selectedProject.id
      });
      await loadTasks();
      await loadData(); // Refresh stats
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskUpdate = async (id: number, data: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
  }) => {
    try {
      await tasksAPI.update(id, data);
      await loadTasks();
      await loadData(); // Refresh stats
      if (data.completed !== undefined) {
        toast.success(data.completed ? 'Task completed!' : 'Task reopened!');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDelete = async (id: number) => {
    try {
      await tasksAPI.delete(id);
      await loadTasks();
      await loadData(); // Refresh stats
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleLogout = () => {
    auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <ProjectSidebar
              projects={projects}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
              onProjectCreate={handleProjectCreate}
              onProjectUpdate={handleProjectUpdate}
              onProjectDelete={handleProjectDelete}
              onLogout={handleLogout}
              stats={stats}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
          onProjectCreate={handleProjectCreate}
          onProjectUpdate={handleProjectUpdate}
          onProjectDelete={handleProjectDelete}
          onLogout={handleLogout}
          stats={stats}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {selectedProject ? selectedProject.name : 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {selectedProject ? `${tasks.filter(t => !t.completed).length} active tasks` : 'Overview'}
                </p>
              </div>

              {/* Filter buttons */}
              {selectedProject && (
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-gray-200 p-1">
                    {(['all', 'active', 'completed'] as const).map((filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                          filter === filterOption
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="p-4 sm:p-6">
          {selectedProject ? (
            <TaskList
              tasks={tasks}
              project={selectedProject}
              onTaskCreate={handleTaskCreate}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2V5a2 2 0 00-2-2H9z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No project selected</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}