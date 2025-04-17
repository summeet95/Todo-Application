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
  const [currentUpdateId, setCurrentUpdateId] = useState(null);

  const LOCAL_STORAGE_KEY = "myTaskList";

  const saveToLocalStorage = (tasks) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://todo-application-uvwv.onrender.com/api/tasks");
      setTodos(response.data);
      saveToLocalStorage(response.data);
    } catch (error) {
      console.error("API error, loading from local storage:", error);
      const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTasks) {
        setTodos(JSON.parse(savedTasks));
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const handleAddTodo = async () => {
    try {
      const response = await axios.post("https://todo-application-uvwv.onrender.com/tasks", todo);
      const updatedTasks = [...todos, response.data];
      setTodos(updatedTasks);
      saveToLocalStorage(updatedTasks);
      resetForm();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://todo-application-uvwv.onrender.com/tasks/${id}`);
      const updatedTasks = todos.filter((task) => task._id !== id);
      setTodos(updatedTasks);
      saveToLocalStorage(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = (id) => {
    const taskToUpdate = todos.find((task) => task._id === id);
    if (taskToUpdate) {
      setTodo({ ...taskToUpdate });
      setCurrentUpdateId(id);
    }
  };

  const handleSaveUpdate = async () => {
    try {
      const response = await axios.put(
        `https://todo-application-uvwv.onrender.com/tasks/${currentUpdateId}`,
        todo
      );
      const updatedTasks = todos.map((task) =>
        task._id === currentUpdateId ? { ...task, ...response.data } : task
      );
      setTodos(updatedTasks);
      saveToLocalStorage(updatedTasks);
      resetForm();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const resetForm = () => {
    setTodo({
      title: "",
      description: "",
      date: "",
      priority: "Medium",
      status: "Pending",
      progress: "0%",
    });
    setCurrentUpdateId(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-800">
      {/* Sidebar Form */}
      <div className="w-full md:w-1/3 p-6 border-r border-gray-300 bg-white">
        <h2 className="text-xl font-semibold mb-4">
          {currentUpdateId ? "Update Task" : "Add Task"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={todo.title}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={todo.description}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
        />

        <input
          type="date"
          name="date"
          value={todo.date}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
        />

        <select
          name="priority"
          value={todo.priority}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          name="status"
          value={todo.status}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          onClick={currentUpdateId ? handleSaveUpdate : handleAddTodo}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {currentUpdateId ? "Save Update" : "Save Task"}
        </button>
      </div>

      {/* Task Table */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Task List</h1>
        <table className="w-full bg-white border border-gray-300 rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Priority</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No tasks available.
                </td>
              </tr>
            ) : (
              todos.map((task) => (
                <tr key={task._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{task.title}</td>
                  <td className="py-2 px-4">{task.description}</td>
                  <td className="py-2 px-4">
                    {new Date(task.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-2 px-4">{task.status}</td>
                  <td className="py-2 px-4">{task.priority}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleUpdate(task._id)}
                      className="bg-yellow-400 px-3 py-1 rounded text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-400 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
