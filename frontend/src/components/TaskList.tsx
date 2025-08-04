'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import type { Task, Project } from '@/services/api';
import toast from 'react-hot-toast';

interface TaskListProps {
  tasks: Task[];
  project: Project;
  onTaskCreate: (taskData: {
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
  }) => void;
  onTaskUpdate: (id: number, data: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
  }) => void;
  onTaskDelete: (id: number) => void;
}

export default function TaskList({
  tasks,
  project,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete
}: TaskListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [editDueDate, setEditDueDate] = useState('');

  const priorityColors = {
    LOW: 'text-green-600 bg-green-100',
    MEDIUM: 'text-yellow-600 bg-yellow-100',
    HIGH: 'text-orange-600 bg-orange-100',
    URGENT: 'text-red-600 bg-red-100'
  };

  const priorityIcons = {
    LOW: '🟢',
    MEDIUM: '🟡',
    HIGH: '🟠',
    URGENT: '🔴'
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      await onTaskCreate({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || undefined
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('MEDIUM');
      setNewTaskDueDate('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      await onTaskUpdate(editingTask.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
        dueDate: editDueDate || undefined
      });
      setEditingTask(null);
      setEditTitle('');
      setEditDescription('');
      setEditPriority('MEDIUM');
      setEditDueDate('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await onTaskDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await onTaskUpdate(task.id, { completed: !task.completed });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('MEDIUM');
    setEditDueDate('');
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    // For now, we'll just reorder locally
    // In a real app, you'd want to persist the order to the backend
    console.log('Task reordered:', result);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
          <p className="text-gray-500">
            {tasks.filter(t => !t.completed).length} active tasks
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter task title"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter task description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2V5a2 2 0 00-2-2H9z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
                </div>
              ) : (
                tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white rounded-lg border border-gray-200 p-4 transition-all ${
                          task.completed ? 'opacity-75' : ''
                        }`}
                      >
                        {editingTask?.id === task.id ? (
                          <form onSubmit={handleUpdateTask} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                              </label>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                autoFocus
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Priority
                                </label>
                                <select
                                  value={editPriority}
                                  onChange={(e) => setEditPriority(e.target.value as any)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                  <option value="LOW">Low</option>
                                  <option value="MEDIUM">Medium</option>
                                  <option value="HIGH">High</option>
                                  <option value="URGENT">Urgent</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Due Date
                                </label>
                                <input
                                  type="date"
                                  value={editDueDate}
                                  onChange={(e) => setEditDueDate(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleComplete(task)}
                              className={`flex-shrink-0 mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                task.completed
                                  ? 'bg-primary-600 border-primary-600'
                                  : 'border-gray-300 hover:border-primary-600'
                              }`}
                            >
                              {task.completed && <CheckIcon className="h-3 w-3 text-white" />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className={`text-sm font-medium ${
                                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                  }`}>
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className={`mt-1 text-sm ${
                                      task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                                    }`}>
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                      <FlagIcon className="h-3 w-3 mr-1" />
                                      {task.priority}
                                    </span>
                                    {task.dueDate && (
                                      <span className={`inline-flex items-center text-xs ${
                                        isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
                                      }`}>
                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                        {formatDate(task.dueDate)}
                                        {isOverdue(task.dueDate) && ' (Overdue)'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => startEditing(task)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task)}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}