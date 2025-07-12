import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import ProjectBoard from './pages/ProjectBoard'
import ArchivedTasks from './pages/ArchivedTasks'
import { ProjectProvider } from './contexts/ProjectContext'
import { TaskProvider } from './contexts/TaskContext'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    // Check if Electron API is available
    console.log('Electron API available:', !!window.electronAPI)
    if (window.electronAPI) {
      console.log('Electron API methods:', Object.keys(window.electronAPI))
      
      // Test the API
      try {
        const result = window.electronAPI.test()
        console.log('Test result:', result)
      } catch (error) {
        console.error('Test failed:', error)
      }
    } else {
      console.warn('Electron API not available - running in browser mode')
    }
  }, [])

  return (
    <ProjectProvider>
      <TaskProvider>
        <Router>
          <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/project/:projectId" element={<ProjectBoard />} />
                    <Route path="/archived" element={<ArchivedTasks />} />
                  </Routes>
                </main>
              </div>
            </div>
          </div>
        </Router>
      </TaskProvider>
    </ProjectProvider>
  )
}

export default App 