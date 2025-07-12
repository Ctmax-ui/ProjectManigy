import React, { useState } from 'react'
import { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Task } from '../types/electron'

interface TaskTableViewProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onUpdateTask: (task: Task) => void
}

type SortField = 'title' | 'status' | 'priority' | 'due_date' | 'created_at'
type SortDirection = 'asc' | 'desc'

const TaskTableView: React.FC<TaskTableViewProps> = ({ tasks, onEditTask, onDeleteTask, onUpdateTask }) => {
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false
      return true
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'due_date' || sortField === 'created_at') {
        aValue = aValue ? new Date(aValue).getTime() : 0
        bValue = bValue ? new Date(bValue).getTime() : 0
      } else {
        aValue = aValue?.toLowerCase() || ''
        bValue = bValue?.toLowerCase() || ''
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FiChevronDown className="w-4 h-4 text-gray-600/0 " />
    return sortDirection === 'asc' ? 
      <FiChevronUp className="w-4 h-4 text-gray-400" /> : 
      <FiChevronDown className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 select-none">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-1 justify-between">
                  <span>Task</span>
                  <SortIcon field="title" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1 justify-between">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center space-x-1 justify-between">
                  <span>Priority</span>
                  <SortIcon field="priority" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('due_date')}
              >
                <div className="flex items-center space-x-1 justify-between">
                  <span>Due Date</span>
                  <SortIcon field="due_date" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center space-x-1 justify-between">
                  <span>Created</span>
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {task.description.length > 50 
                          ? `${task.description.substring(0, 50)}...` 
                          : task.description
                        }
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={task.status}
                    onChange={(e) => onUpdateTask({ ...task, status: e.target.value as Task['status'] })}
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-1">
                    <FiFlag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                    <span className="text-sm text-gray-900 dark:text-white capitalize">
                      {task.priority}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {task.due_date ? (
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No due date</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2 gap-2">
                    <button
                      onClick={() => onEditTask(task)}
                      className="text-white hover:bg-primary-500/70 p-2 rounded-full hover:text-white"
                      title="Edit Task"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-400 hover:bg-red-500/70 p-2 rounded-full hover:text-white"
                      title="Delete Task"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedTasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
        </div>
      )}
    </div>
  )
}

export default TaskTableView 