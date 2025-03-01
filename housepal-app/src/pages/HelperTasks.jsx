import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import NavBarPostLogin from "../components/NavBarPostLogin";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const TaskCard = ({ task, onDragStart }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task._id);
    e.dataTransfer.setData("sourceColumn", task.status);
    onDragStart(task._id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-blue-200";
      case "in-progress": return "bg-yellow-200";
      case "completed": return "bg-green-200";
      default: return "bg-white";
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`p-4 mb-4 rounded-lg shadow-md border border-gray-200 cursor-move hover:shadow-lg transition-shadow ${getStatusColor(task.status)}`}
    >
      <h3 className="text-lg font-bold text-gray-800">{task.jobId?.jobTitle || task.jobTitle || "Unknown Job"}</h3>
      <p className="text-sm text-gray-600">Category: {task.jobId?.category || task.jobCategory || "N/A"}</p>
      <p className="text-sm text-gray-600">Subcategory: {task.jobId?.subCategory || task.jobSubCategory || "N/A"}</p>
      <p className="text-sm text-gray-600">Location: {task.jobId?.location || task.location || "N/A"}</p>
      <p className="text-sm text-gray-600">Status: {task.status}</p>
    </div>
  );
};

const Column = ({ title, tasks, droppableId, onDrop }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-gray-200");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("bg-gray-200");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");
    onDrop(taskId, sourceColumn, droppableId);
    e.currentTarget.classList.remove("bg-gray-200");
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="bg-gray-100 p-4 rounded-lg shadow-md transition-colors duration-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="min-h-[200px]">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task._id} task={task} onDragStart={() => { }} />)
        ) : (
          <p className="text-gray-600">No tasks here.</p>
        )}
      </div>
    </div>
  );
};

const HelperTasks = () => {
  const [tasks, setTasks] = useState({ pending: [], "in-progress": [], completed: [] });
  const [componentLoading, setComponentLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    if (!user || !user.email) {
      setError("User not authenticated");
      setComponentLoading(false);
      navigate("/login");
      return;
    }

    setComponentLoading(true);
    try {
      console.log(`Fetching tasks for helper: ${user.email}`);
      const res = await api.get(`/tasks/helper/${user.email}`);
      console.log("Raw API response:", JSON.stringify(res.data, null, 2));
      if (!Array.isArray(res.data)) {
        console.error("Expected an array, got:", res.data);
        setError("Invalid task data format from server");
        return;
      }
      const categorizedTasks = {
        pending: res.data.filter((task) => task.status === "pending"),
        "in-progress": res.data.filter((task) => task.status === "in-progress"),
        completed: res.data.filter((task) => task.status === "completed"),
      };
      console.log("Categorized tasks:", JSON.stringify(categorizedTasks, null, 2));
      setTasks(categorizedTasks);
    } catch (err) {
      setError("Failed to load tasks: " + (err.response?.data?.message || "Unknown error"));
      console.error("Task fetch error:", err.response?.data || err.message);
    } finally {
      setComponentLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchTasks();
  }, [user, authLoading, navigate]);

  const handleDrop = async (taskId, sourceColumn, destColumn) => {
    if (sourceColumn === destColumn) return;

    const sourceTasks = [...tasks[sourceColumn]];
    const destTasks = [...tasks[destColumn]];
    const taskIndex = sourceTasks.findIndex((task) => task._id === taskId);
    if (taskIndex === -1) return;

    const [movedTask] = sourceTasks.splice(taskIndex, 1);
    const updatedTask = { ...movedTask, status: destColumn };
    destTasks.push(updatedTask);

    const newTasks = { ...tasks, [sourceColumn]: sourceTasks, [destColumn]: destTasks };
    setTasks(newTasks);

    try {
      await api.put(`/tasks/${taskId}/status`, {
        status: destColumn,
        completionDateTime: destColumn === "completed" ? new Date().toISOString() : undefined,
      });
      console.log(`Task ${taskId} status updated to ${destColumn}`);
    } catch (err) {
      setTasks(tasks); // Revert on error
      setError("Failed to update task status: " + (err.response?.data?.message || "Unknown error"));
      console.error("Status update error:", err.response?.data || err.message);
    }
  };

  if (authLoading) return <div className="text-gray-700 mt-4">Loading authentication...</div>;

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="relative">
          <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
            Your Tasks
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
              alt="double-line"
              className="mt-2 w-40 lg:w-64"
            />
          </h1>
          <button
            onClick={fetchTasks}
            className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
          >
            Refresh Tasks
          </button>
        </div>
        {componentLoading && <p className="text-gray-700 mt-4">Loading tasks...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {!componentLoading && !error && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Column title="Pending" tasks={tasks.pending} droppableId="pending" onDrop={handleDrop} />
            <Column title="In Progress" tasks={tasks["in-progress"]} droppableId="in-progress" onDrop={handleDrop} />
            <Column title="Completed" tasks={tasks.completed} droppableId="completed" onDrop={handleDrop} />
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default HelperTasks;