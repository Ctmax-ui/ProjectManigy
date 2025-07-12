import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Task } from '../types/electron'

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  getTasks: (projectId: string) => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  updateTaskPosition: (taskId: string, position: number) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  getArchivedTasks: () => Promise<Task[]>
  archiveDoneTasks: () => Promise<void>
  currentProjectId: string | null
  setCurrentProjectId: (projectId: string | null) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

interface TaskProviderProps {
  children: ReactNode
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)

  const getTasks = async (projectId: string) => {
    setLoading(true)
    try {
      setError(null)
      const tasksData = await window.electronAPI.getTasks(projectId)
      setTasks(tasksData)
      setCurrentProjectId(projectId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      return setLoading(false)
    }
  }

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const task = {
        ...taskData,
        id: crypto.randomUUID(),
      }
      await window.electronAPI.createTask(task)
      if (currentProjectId) {
        await getTasks(currentProjectId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    }
  }

  const updateTask = async (task: Task) => {
    try {
      await window.electronAPI.updateTask(task)
      if (currentProjectId) {
        await getTasks(currentProjectId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    }
  }

  const updateTaskPosition = async (taskId: string, position: number) => {
    try {
      await window.electronAPI.updateTaskPosition(taskId, position)
      if (currentProjectId) {
        await getTasks(currentProjectId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task position')
      throw err
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await window.electronAPI.deleteTask(taskId)
      if (currentProjectId) {
        await getTasks(currentProjectId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      throw err
    }
  }

  const getArchivedTasks = async (): Promise<Task[]> => {
    try {
      const archivedTasks = await window.electronAPI.getArchivedTasks()
      return archivedTasks
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get archived tasks')
      return []
    }
  }

  const archiveDoneTasks = async (): Promise<void> => {
    try {
      await window.electronAPI.archiveDoneTasks()
      // Refresh tasks to reflect archived status
      if (currentProjectId) {
        await getTasks(currentProjectId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive done tasks')
      throw err
    }
  }

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    getTasks,
    createTask,
    updateTask,
    updateTaskPosition,
    deleteTask,
    getArchivedTasks,
    archiveDoneTasks,
    currentProjectId,
    setCurrentProjectId,
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
} 