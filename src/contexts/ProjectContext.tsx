import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  created_at: string
  updated_at: string
}

interface ProjectContextType {
  projects: Project[]
  loading: boolean
  error: string | null
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateProject: (project: Project) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  refreshProjects: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
}

interface ProjectProviderProps {
  children: ReactNode
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if electronAPI is available
      if (!window.electronAPI) {
        console.warn('Electron API not available, using mock data')
        setProjects([])
        return
      }
      
      const projectsData = await window.electronAPI.getProjects()
      setProjects(projectsData)
    } catch (err) {
      console.error('Error loading projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const now = new Date()
      const project = {
        ...projectData,
        id: crypto.randomUUID(),
        created_at:now
      }
      
      // Check if electronAPI is available
      if (!window.electronAPI) {
        console.warn('Electron API not available, cannot create project')
        throw new Error('Electron API not available')
      }
      
      await window.electronAPI.createProject(project)
      await refreshProjects()
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err instanceof Error ? err.message : 'Failed to create project')
      throw err
    }
  }

  const updateProject = async (project: Project) => {
    try {
      await window.electronAPI.updateProject(project)
      await refreshProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
      throw err
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      await window.electronAPI.deleteProject(projectId)
      // await refreshProjects()
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      throw err
    }
  }

  useEffect(() => {
    refreshProjects()
  }, [])

  const value: ProjectContextType = {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
} 