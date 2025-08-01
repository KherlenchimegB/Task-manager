import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';

interface Project {
  id: number;
  name: string;
  color: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
}

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
      
      // Select first project by default
      if (response.data.length > 0 && !selectedProject) {
        setSelectedProject(response.data[0]);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load projects');
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Clear authentication data
            // In a real app, you'd clear AsyncStorage
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return '#10b981';
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return '#f97316';
      case 'URGENT': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'Low';
      case 'MEDIUM': return 'Medium';
      case 'HIGH': return 'High';
      case 'URGENT': return 'Urgent';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Manager</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Project Selector */}
        <View style={styles.projectSelector}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={[
                  styles.projectCard,
                  selectedProject?.id === project.id && styles.selectedProjectCard,
                ]}
                onPress={() => setSelectedProject(project)}
              >
                <View
                  style={[
                    styles.projectColor,
                    { backgroundColor: project.color },
                  ]}
                />
                <Text
                  style={[
                    styles.projectName,
                    selectedProject?.id === project.id && styles.selectedProjectName,
                  ]}
                >
                  {project.name}
                </Text>
                <Text style={styles.taskCount}>
                  {project.tasks.length} tasks
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selected Project Tasks */}
        {selectedProject && (
          <View style={styles.tasksSection}>
            <View style={styles.tasksHeader}>
              <Text style={styles.sectionTitle}>{selectedProject.name}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Task</Text>
              </TouchableOpacity>
            </View>

            {selectedProject.tasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No tasks yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Create your first task to get started
                </Text>
              </View>
            ) : (
              selectedProject.tasks.map((task) => (
                <View
                  key={task.id}
                  style={[
                    styles.taskCard,
                    task.completed && styles.completedTaskCard,
                  ]}
                >
                  <View style={styles.taskHeader}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.completedTaskTitle,
                      ]}
                    >
                      {task.title}
                    </Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(task.priority) },
                      ]}
                    >
                      <Text style={styles.priorityText}>
                        {getPriorityText(task.priority)}
                      </Text>
                    </View>
                  </View>
                  
                  {task.description && (
                    <Text
                      style={[
                        styles.taskDescription,
                        task.completed && styles.completedTaskDescription,
                      ]}
                    >
                      {task.description}
                    </Text>
                  )}
                  
                  {task.dueDate && (
                    <Text style={styles.dueDate}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {projects.reduce((total, project) => total + project.tasks.length, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {projects.reduce(
                  (total, project) =>
                    total + project.tasks.filter((task) => task.completed).length,
                  0
                )}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{projects.length}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  projectSelector: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedProjectCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  projectColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedProjectName: {
    color: '#3b82f6',
  },
  taskCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  tasksSection: {
    padding: 20,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedTaskCard: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  completedTaskDescription: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  dueDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statsSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
}); 