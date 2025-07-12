import React, { useState, useEffect } from 'react'
import { FiRotateCcw, FiTrash2, FiCalendar, FiFlag, FiFolder } from 'react-icons/fi'
import { useTasks } from '../contexts/TaskContext'
import { useProjects } from '../contexts/ProjectContext'
import { Task } from '../types/electron'

const ArchivedTasks: React.FC = () => {
  const { getArchivedTasks } = useTasks()
  const { projects } = useProjects()
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArchivedTasks()
  }, [])

  const loadArchivedTasks = async () => {
    setLoading(true)
    try {
      const tasks = await getArchivedTasks()
      setArchivedTasks(tasks)
    } catch (error) {
      console.error('Failed to load archived tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || 'Unknown Project'
  }

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project?.color || '#3b82f6'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading archived tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Archived Tasks
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tasks that have been automatically archived after being completed for 24 hours.
        </p>
      </div>

      {archivedTasks.length === 0 ? (
        <div className="text-center py-12">
          <FiFolder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No archived tasks
          </h3>
          <p className="text-gray-500">
            Completed tasks will be automatically archived after 24 hours.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {archivedTasks.length} Archived Task{archivedTasks.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {archivedTasks.map((task) => (
              <div key={task.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getProjectColor(task.project_id) }}
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getProjectName(task.project_id)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FiFlag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                        <span className="capitalize">{task.priority}</span>
                      </div>
                      
                      {task.due_date && (
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="w-4 h-4" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {task.archived_at && (
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="w-4 h-4" />
                          <span>Archived: {new Date(task.archived_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      className="text-gray-400 hover:text-primary-500"
                      title="Restore Task"
                      onClick={() => {
                        // TODO: Implement restore functionality
                        console.log('Restore task:', task.id)
                      }}
                    >
                      <FiRotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      title="Delete Permanently"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to permanently delete this task?')) {
                          // TODO: Implement permanent deletion
                          console.log('Delete task permanently:', task.id)
                        }
                      }}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ArchivedTasks 