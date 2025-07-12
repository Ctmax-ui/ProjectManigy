const { contextBridge, ipcRenderer } = require('electron')

console.log('Preload script loaded successfully')

// Expose a simple test API first
contextBridge.exposeInMainWorld('electronAPI', {
  // Test function
  test: () => {
    console.log('Test function called from renderer')
    return 'Hello from Electron!'
  },
  
  // Project operations
  getProjects: () => {
    console.log('getProjects called')
    return ipcRenderer.invoke('db:get-projects')
  },
  createProject: (project) => {
    console.log('createProject called with:', project)
    return ipcRenderer.invoke('db:create-project', project)
  },
  updateProject: (project) => ipcRenderer.invoke('db:update-project', project),
  deleteProject: (projectId) => ipcRenderer.invoke('db:delete-project', projectId),
  
  // Task operations
  getTasks: (projectId) => ipcRenderer.invoke('db:get-tasks', projectId),
  createTask: (task) => ipcRenderer.invoke('db:create-task', task),
  updateTask: (task) => ipcRenderer.invoke('db:update-task', task),
  updateTaskPosition: (taskId, position) => ipcRenderer.invoke('db:update-task-position', taskId, position),
  deleteTask: (taskId) => ipcRenderer.invoke('db:delete-task', taskId),
  getArchivedTasks: () => ipcRenderer.invoke('db:get-archived-tasks'),
  archiveDoneTasks: () => ipcRenderer.invoke('db:archive-done-tasks'),
})

console.log('electronAPI exposed to window with methods:', Object.keys({
  test: () => {},
  getProjects: () => {},
  createProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  getTasks: () => {},
  createTask: () => {},
  updateTask: () => {},
  updateTaskPosition: () => {},
  deleteTask: () => {},
  getArchivedTasks: () => {},
  archiveDoneTasks: () => {},
})) 