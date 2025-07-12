import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  FiPlus,
  FiCalendar,
  FiFlag,
  FiEdit2,
  FiGrid,
  FiList,
  FiTrash2,
} from "react-icons/fi";
import { FaHouse } from "react-icons/fa6";
import { useProjects } from "../contexts/ProjectContext";
import { useTasks } from "../contexts/TaskContext";
import { Task } from "../types/electron";
import TaskModal from "../components/TaskModal";
import TaskTableView from "../components/TaskTableView";

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useProjects();
  const { tasks, getTasks, updateTaskPosition, updateTask, deleteTask } =
    useTasks();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalTask, setModalTask] = useState<Task | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (projectId) {
      getTasks(projectId);
    }
  }, [projectId, getTasks]);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-gray-100 dark:bg-gray-700" },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-100 dark:bg-blue-900",
    },
    { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900" },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) {
      // Same column - reorder
      const columnTasks = getTasksByStatus(source.droppableId);
      const newTasks = Array.from(columnTasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      // Update positions
      for (let i = 0; i < newTasks.length; i++) {
        await updateTaskPosition(newTasks[i].id, i);
      }
    } else {
      // Different column - move and update status
      const task = tasks.find((t) => t.id === draggableId);
      if (task) {
        // Update status and position
        await updateTask({
          ...task,
          status: destination.droppableId as Task["status"],
        });
        await updateTaskPosition(task.id, destination.index);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const handleEditTask = (task: Task) => {
    setModalTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      await updateTask(task);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Project not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The project you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-2">
      <Link
        to={"/"}
        className="text-white bg-primary-500 hover:bg-primary-600 transition-all px-3 py-2 rounded-md flex items-center gap-1 w-fit"
      >
        <FaHouse />
        Home
      </Link>
      <div className="mb-6 mt-3">
        <div className="flex items-center justify-between">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <FiGrid className="w-4 h-4" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <FiList className="w-4 h-4" />
                <span>Table</span>
              </button>
            </div>

            <button
              onClick={() => {
                setShowTaskModal(true);
                setModalTask(undefined);
              }}
              className="btn btn-primary px-3 py-3"
            >
              <FiPlus size={20} className="mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div
                key={column.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {column.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getTasksByStatus(column.id).length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 min-h-[400px] h-[91.5%] rounded-lg ${
                        snapshot.isDraggingOver
                          ? "bg-gray-50 dark:bg-gray-700"
                          : ""
                      }`}
                    >
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white dark:bg-gray-700 rounded-lg p-4 mb-3 shadow-sm border border-gray-200 dark:border-gray-600 ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                  {task.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <button
                                    className="text-gray-400 hover:text-primary-500 p-1 rounded-full"
                                    title="Edit Task"
                                    onClick={() => handleEditTask(task)}
                                  >
                                    <FiEdit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-gray-400 hover:text-red-500"
                                    title="Delete Task"
                                    onClick={() => handleDeleteTask(task.id)}
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              {task.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <FiFlag
                                    className={`w-4 h-4 ${getPriorityColor(
                                      task.priority
                                    )}`}
                                  />
                                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {task.priority}
                                  </span>
                                </div>
                                {task.due_date && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <FiCalendar className="w-3 h-3 mr-1" />
                                    {new Date(
                                      task.due_date
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <TaskTableView
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {showTaskModal && (
        <TaskModal
          projectId={projectId!}
          onClose={() => {
            setShowTaskModal(false);
            setModalTask(undefined);
          }}
          task={modalTask}
          mode={modalTask ? "edit" : "create"}
        />
      )}
    </div>
  );
};

export default ProjectBoard;
