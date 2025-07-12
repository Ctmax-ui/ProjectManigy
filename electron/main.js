const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const isDev = process.env.IS_DEV === 'true'

// Database setup
const Database = require('better-sqlite3')
let db

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js')
  console.log('Preload script path:', preloadPath)
  
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'default',
    show: false,
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  return mainWindow
}

function initializeDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'projectmanigy.db')
  // console.log(dbPath);
  db = new Database(dbPath)
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#3b82f6',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo',
      priority TEXT DEFAULT 'medium',
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      position INTEGER DEFAULT 0,
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Add new columns if they don't exist (database migration)
  try {
    // Check if archived column exists
    const archivedCheck = db.prepare("PRAGMA table_info(tasks)").all()
    const hasArchivedColumn = archivedCheck.some(col => col.name === 'archived')
    
    if (!hasArchivedColumn) {
      console.log('Adding archived column to tasks table...')
      db.exec(`
        ALTER TABLE tasks ADD COLUMN archived INTEGER DEFAULT 0;
        ALTER TABLE tasks ADD COLUMN archived_at DATETIME;
      `)
      console.log('Database migration completed successfully')
    }
  } catch (error) {
    console.error('Database migration error:', error)
  }
}

// IPC Handlers
ipcMain.handle('db:get-projects', () => {
  const stmt = db.prepare('SELECT * FROM projects ORDER BY created_at DESC')
  return stmt.all()
})

ipcMain.handle('db:create-project', (event, project) => {
  const stmt = db.prepare(`
    INSERT INTO projects (id, name, description, color)
    VALUES (?, ?, ?, ?)
  `)
  return stmt.run(project.id, project.name, project.description, project.color)
})

ipcMain.handle('db:update-project', (event, project) => {
  const stmt = db.prepare(`
    UPDATE projects 
    SET name = ?, description = ?, color = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  return stmt.run(project.name, project.description, project.color, project.id)
})

ipcMain.handle('db:delete-project', (event, projectId) => {
  const stmt = db.prepare('DELETE FROM projects WHERE id = ?')
  return stmt.run(projectId)
})

ipcMain.handle('db:get-tasks', (event, projectId) => {
  try {
    // Check if archived column exists
    const archivedCheck = db.prepare("PRAGMA table_info(tasks)").all()
    const hasArchivedColumn = archivedCheck.some(col => col.name === 'archived')
    
    if (hasArchivedColumn) {
      const stmt = db.prepare(`
        SELECT * FROM tasks 
        WHERE project_id = ? AND archived = 0
        ORDER BY position ASC, created_at ASC
      `)
      return stmt.all(projectId)
    } else {
      // Fallback for databases without archived column
      const stmt = db.prepare(`
        SELECT * FROM tasks 
        WHERE project_id = ?
        ORDER BY position ASC, created_at ASC
      `)
      return stmt.all(projectId)
    }
  } catch (error) {
    console.error('Error getting tasks:', error)
    // Fallback query
    const stmt = db.prepare(`
      SELECT * FROM tasks 
      WHERE project_id = ?
      ORDER BY position ASC, created_at ASC
    `)
    return stmt.all(projectId)
  }
})

ipcMain.handle('db:create-task', (event, task) => {
  const stmt = db.prepare(`
    INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  return stmt.run(
    task.id, 
    task.project_id, 
    task.title, 
    task.description, 
    task.status, 
    task.priority, 
    task.due_date, 
    task.position
  )
})

ipcMain.handle('db:update-task', (event, task) => {
  const stmt = db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  return stmt.run(task.title, task.description, task.status, task.priority, task.due_date, task.id)
})

ipcMain.handle('db:update-task-position', (event, taskId, position) => {
  const stmt = db.prepare('UPDATE tasks SET position = ? WHERE id = ?')
  return stmt.run(position, taskId)
})

ipcMain.handle('db:delete-task', (event, taskId) => {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?')
  return stmt.run(taskId)
})

ipcMain.handle('db:get-archived-tasks', () => {
  try {
    // Check if archived column exists
    const archivedCheck = db.prepare("PRAGMA table_info(tasks)").all()
    const hasArchivedColumn = archivedCheck.some(col => col.name === 'archived')
    
    if (hasArchivedColumn) {
      const stmt = db.prepare('SELECT * FROM tasks WHERE archived = 1 ORDER BY archived_at DESC')
      return stmt.all()
    } else {
      // Return empty array if archived column doesn't exist
      return []
    }
  } catch (error) {
    console.error('Error getting archived tasks:', error)
    return []
  }
})

ipcMain.handle('db:archive-done-tasks', () => {
  try {
    // Check if archived column exists
    const archivedCheck = db.prepare("PRAGMA table_info(tasks)").all()
    const hasArchivedColumn = archivedCheck.some(col => col.name === 'archived')
    
    if (hasArchivedColumn) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const stmt = db.prepare(`
        UPDATE tasks 
        SET archived = 1, archived_at = CURRENT_TIMESTAMP 
        WHERE status = 'done' AND updated_at < ? AND archived = 0
      `)
      return stmt.run(oneDayAgo)
    } else {
      // Do nothing if archived column doesn't exist
      return { changes: 0 }
    }
  } catch (error) {
    console.error('Error archiving done tasks:', error)
    return { changes: 0 }
  }
})

app.whenReady().then(() => {
  initializeDatabase()
  createWindow()

  // Auto-archive done tasks after 24 hours
  setInterval(async () => {
    try {
      // Check if archived column exists
      const archivedCheck = db.prepare("PRAGMA table_info(tasks)").all()
      const hasArchivedColumn = archivedCheck.some(col => col.name === 'archived')
      
      if (hasArchivedColumn) {
        await db.prepare(`
          UPDATE tasks 
          SET archived = 1, archived_at = CURRENT_TIMESTAMP 
          WHERE status = 'done' AND updated_at < datetime('now', '-1 day') AND archived = 0
        `).run()
        console.log('Auto-archived done tasks')
      }
    } catch (error) {
      console.error('Failed to auto-archive tasks:', error)
    }
  }, 60 * 60 * 1000) // Run every hour

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 