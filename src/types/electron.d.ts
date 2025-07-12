export interface Project {
  id: string
  name: string
  description?: string
  color: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  archived?: number
  archived_at?: string
  created_at: string
  updated_at: string
  position: number
}

declare global {
  interface Window {
    electronAPI: {
      test: () => string
      getProjects: () => Promise<Project[]>
      createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<any>
      updateProject: (project: Project) => Promise<any>
      deleteProject: (projectId: string) => Promise<any>
      getTasks: (projectId: string) => Promise<Task[]>
      createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<any>
      updateTask: (task: Task) => Promise<any>
      updateTaskPosition: (taskId: string, position: number) => Promise<any>
      deleteTask: (taskId: string) => Promise<any>
      getArchivedTasks: () => Promise<Task[]>
      archiveDoneTasks: () => Promise<any>
    }
  }
} 