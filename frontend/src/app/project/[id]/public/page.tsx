'use client';

import { useState, useEffect } from "react";
import { CheckIcon } from '@heroicons/react/24/outline';

export default function PublicProjectPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      fetch(`/api/projects/${params.id}/public`)
        .then(res => res.json())
        .then(data => {
          setProject(data.project);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, [params.id]);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!project) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
            <p className="text-gray-600">The project you're looking for doesn't exist or is private.</p>
          </div>
        </div>
      );
    }

    const completedTasks = project.tasks?.filter((task: any) => task.completed).length || 0;
    const totalTasks = project.tasks?.length || 0;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: project.color }}
              />
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            </div>

            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">
                  {completedTasks} of {totalTasks} tasks completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-primary-600">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>

            {/* Tasks List */}
            {project.tasks && project.tasks.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h2>
                {project.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className={`flex items-center p-4 rounded-lg border ${
                      task.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                      task.completed
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300'
                    }`}>
                      {task.completed && <CheckIcon className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mt-1 ${
                          task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    {task.priority && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'LOW' ? 'bg-green-100 text-green-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2V5a2 2 0 00-2-2H9z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-sm text-gray-500">This project doesn't have any tasks yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }