import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    date: "",
    priority: "Medium",
    status: "Pending",
    progress: "0%",
  });
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const handleAddTodo = async () => {
    try {
      const response = await axios.post("http://localhost:5000/tasks", todo);
      setTodos([...todos, response.data]);
      setTodo({
        title: "",
        description: "",
        date: "",
        priority: "Medium",
        status: "Pending",
        progress: "0%",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTodos(todos.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Update task
  const handleUpdate = async (id) => {
    try {
      const updatedTask = { ...todo };
      const response = await axios.put(
        `http://localhost:5000/tasks/${id}`,
        updatedTask
      );
      setTodos(
        todos.map((task) =>
          task._id === id ? { ...task, ...response.data } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const filteredTodos = todos.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority =
      priorityFilter === "All" || item.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-full max-w-sm bg-blue-600 border-r border-blue-500 p-6 space-y-6 shadow-inner">
        <h2 className="text-2xl font-semibold mb-2 text-white">Add Task</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={todo.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={todo.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="date"
          name="date"
          value={todo.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />

        <select
          name="priority"
          value={todo.priority}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          name="status"
          value={todo.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="text"
          name="progress"
          placeholder="Progress (e.g., 30%)"
          value={todo.progress}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />

        <button
          onClick={handleAddTodo}
          className="w-full bg-white text-black py-2 rounded "
        >
          Save Task
        </button>

        {/* Search and Filter */}
        <div className="border-t pt-4 space-y-4">
          <input
            type="text"
            placeholder="Search Task"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md transition-all duration-300 focus:ring-2 focus:ring-blue-300"
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="All">Filter by Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Right Panel - Task Table */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Priority</th>
                <th className="py-3 px-4 text-left">Progress</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTodos.map((task) => (
                  <tr key={task._id} className="border-b">
                    <td className="py-2 px-4">{task.title}</td>
                    <td className="py-2 px-4">{task.description}</td>
                    <td className="py-2 px-4">{task.date}</td>
                    <td className="py-2 px-4">{task.status}</td>
                    <td className="py-2 px-4">{task.priority}</td>
                    <td className="py-2 px-4">{task.progress}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleUpdate(task._id)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
