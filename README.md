# ProjectManigy - Simple & Modern Project Management App

A beautiful and Simple project management application built with Electron, React, TypeScript, and SQLite. Inspired by GitHub Projects and Notion, ProjectManigy provides an intuitive interface for managing projects and tasks with drag-and-drop functionality like Kanban Board, Table View .

## Features

- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 📊 **Kanban Board**: Drag-and-drop task management with status columns
- 🗂️ **Project Management**: Create, edit, and organize projects with custom colors
- ✅ **Task Management**: Add tasks with priorities, due dates, and descriptions
- 💾 **Local Storage**: SQLite database for data persistence
- 🎯 **Priority System**: High, medium, and low priority tasks
- 📅 **Due Date Tracking**: Set and track task deadlines
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ⚡ **Fast Performance**: Built with Vite for rapid development

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop**: Electron
- **Database**: SQLite (better-sqlite3)
- **Build Tool**: Vite
- **Icons**: React Icons (Feather Icons)
- **Drag & Drop**: react-beautiful-dnd
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ProjectManigy
```

2. Install dependencies:
```bash
npm install
```

2.1 Build Electron
```bash
npm run rebuild
```

3. Start the development server:
```bash
npm run electron:dev
```

This will start both the Vite dev server and Electron app in development mode.

### Building for Production

To build the application for production:

```bash
npm run electron:build
```

The built application will be available in the `release` directory.

## Project Structure

```
ProjectManigy/
├── electron/              # Electron main process
│   ├── main.js           # Main process entry point
│   └── preload.js        # Preload script for IPC
├── src/                  # React application
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── dist/                # Built React app
├── dist-electron/       # Built Electron app
└── release/            # Production builds
```

## Database Schema

The application uses SQLite with the following schema:

### Projects Table
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `color` (TEXT, DEFAULT '#3b82f6')
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Tasks Table
- `id` (TEXT, PRIMARY KEY)
- `project_id` (TEXT, FOREIGN KEY)
- `title` (TEXT, NOT NULL)
- `description` (TEXT)
- `status` (TEXT, DEFAULT 'todo')
- `priority` (TEXT, DEFAULT 'medium')
- `due_date` (TEXT)
- `position` (INTEGER, DEFAULT 0)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Usage

### Creating Projects
1. Click the "+" button in the sidebar
2. Fill in the project name, description, and choose a color
3. Click "Create Project"

### Managing Tasks
1. Navigate to a project
2. Click "Add Task" to create a new task
3. Set title, description, priority, and due date
4. Drag and drop tasks between columns to change status

### Features
- **Drag & Drop**: Reorder tasks within columns or move between status columns
- **Priority Colors**: Visual indicators for task priorities
- **Due Dates**: Track task deadlines
- **Search**: Search through projects and tasks
- **Theme Toggle**: Switch between light and dark modes

## Development

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build React app for production
- `npm run electron` - Start Electron app
- `npm run electron:dev` - Start both dev server and Electron
- `npm run electron:build` - Build for production
- `npm run preview` - Preview production build

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by GitHub Projects and Notion
- Built with modern web technologies
- Icons from Feather Icons 
