'use client';

import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { auth } from '@/services/api';
import type { Project, DashboardStats } from '@/services/api';
import toast from 'react-hot-toast';

interface ProjectSidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  onProjectSelect: (project: Project) => void;
  onProjectCreate: (name: string, color: string) => void;
  onProjectUpdate: (id: number, data: { name?: string; color?: string }) => void;
  onProjectDelete: (id: number) => void;
  onLogout: () => void;
  stats: DashboardStats | null;
}

export default function ProjectSidebar({
  projects,
  selectedProject,
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
  onLogout,
  stats
}: ProjectSidebarProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#3B82F6');
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const user = auth.getUser();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      await onProjectCreate(newProjectName.trim(), newProjectColor);
      setNewProjectName('');
      setNewProjectColor('#3B82F6');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editName.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      await onProjectUpdate(editingProject.id, {
        name: editName.trim(),
        color: editColor
      });
      setEditingProject(null);
      setEditName('');
      setEditColor('');
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This will also delete all tasks in this project.`)) {
      try {
        await onProjectDelete(project.id);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditColor(project.color);
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setEditName('');
    setEditColor('');
  };

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2V5a2 2 0 00-2-2H9z" />
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">Task Manager</h1>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-primary-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Overview</h3>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{stats.totalTasks}</p>
                <p className="text-xs text-gray-500">Total Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.activeTasks}</p>
              <p className="text-xs text-gray-500">Active Tasks</p>
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Projects</h3>
            <button
              onClick={() => setShowCreateForm(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Create Project Form */}
          {showCreateForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <form onSubmit={handleCreateProject}>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewProjectColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newProjectColor === color ? 'border-gray-400' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1 ml-auto">
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Project List */}
          <div className="space-y-1">
            {projects.map((project) => (
              <div key={project.id} className="group">
                {editingProject?.id === project.id ? (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <form onSubmit={handleUpdateProject}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        autoFocus
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex gap-1">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setEditColor(color)}
                              className={`w-4 h-4 rounded-full border ${
                                editColor === color ? 'border-gray-400' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex gap-1 ml-auto">
                          <button
                            type="submit"
                            className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button
                    onClick={() => onProjectSelect(project)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedProject?.id === project.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm font-medium">{project.name}</span>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(project);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="flex-shrink-0 p-6 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
          Sign out
        </button>
      </div>
    </div>
  );
} 