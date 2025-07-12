import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiFolder, FiPlus, FiSettings, FiChevronDown, FiTrash2, FiArchive } from 'react-icons/fi'
import { useProjects } from '../contexts/ProjectContext'
import CreateProjectModal from './CreateProjectModal'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { projects, loading, deleteProject } = useProjects()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [expandedProjects, setExpandedProjects] = useState(true)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Archived Tasks', href: '/archived', icon: FiArchive },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (window.confirm(`Are you sure you want to delete the project "${projectName}"? This will also delete all associated tasks.`)) {
      try {
        await deleteProject(projectId)
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  return (
    <>
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <FiFolder className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
            ProjectManigy
            </span>
          </div>
          
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="px-2 mt-6">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setExpandedProjects(!expandedProjects)}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <FiChevronDown className={`mr-1 h-4 w-4 transition-transform ${expandedProjects ? 'rotate-0' : '-rotate-90'}`} />
                Projects
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiPlus className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </button>
            </div>
            
            {expandedProjects && (
              <div className="space-y-1">
                {loading ? (
                  <div className="px-2 py-1 text-sm text-gray-500">Loading...</div>
                ) : projects.length === 0 ? (
                  <div className="px-2 py-1 text-sm text-gray-500">No projects yet</div>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        location.pathname === `/project/${project.id}`
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                    >
                      <Link
                        to={`/project/${project.id}`}
                        className="flex items-center flex-1 min-w-0"
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="truncate">{project.name}</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Project"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <Link
            to="/settings"
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <FiSettings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  )
}

export default Sidebar 