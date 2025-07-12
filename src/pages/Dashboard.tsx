import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiFolder, FiClock, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { useProjects } from "../contexts/ProjectContext";
import { useTasks } from "../contexts/TaskContext";
import { formatDistanceToNow } from "date-fns";
import CreateProjectModal from "@/components/CreateProjectModal";

const Dashboard: React.FC = () => {
  const { projects, loading, deleteProject } = useProjects();
  const { tasks } = useTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const recentProjects = projects.slice(0, 5);
  const totalProjects = projects.length;

  // Calculate real stats
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  // const todoTasks = tasks.filter(task => task.status === 'todo').length;

  const handleDeleteProject = async (
    projectId: string,
    projectName: string
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete the project "${projectName}"? This will also delete all associated tasks.`
      )
    ) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  console.log(projects);

  return (
    <>
      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your projects.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <FiFolder className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="lg:ml-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiFolder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="lg:ml-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0">
              <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
                <FiClock className="w-6 h-6 text-warning-600 dark:text-warning-400" />
              </div>
              <div className="lg:ml-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {inProgressTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0">
              <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
              <div className="lg:ml-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Projects
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading projects...</p>
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <FiFolder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by creating your first project.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary px-3 py-2 "
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/project/${project.id}`}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto mr-3">
                        Created {formatDistanceToNow(new Date(project.created_at.replace(" ", "T") + "Z"), { addSuffix: true })}
                      </div>
                      <div className="">
                        <button
                          onClick={() =>
                            handleDeleteProject(project.id, project.name)
                          }
                          className="ml-2 text-gray-400 hover:text-red-500"
                          title="Delete Project"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
