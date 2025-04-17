import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

function Register() {
  // State for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for error message
  const [error, setError] = useState("");

  // State for success message
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // Using useNavigate for navigation

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send POST request to the backend to register the user
      const response = await axios.post(
        "https://todo-application-uvwv.onrender.com/register",
        formData
      );

      // If registration is successful, show success message and redirect
      setSuccessMessage(response.data.msg);
      setError(""); // Clear any previous error message

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/"); // Redirect to the login page using useNavigate
      }, 2000); // Delay of 2 seconds before redirecting
    } catch (err) {
      // Handle errors if any (e.g., user already exists)
      setError(err.response ? err.response.data.msg : "Server error");
      setSuccessMessage(""); // Clear any success message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Create a New Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-5 py-3 border text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 border text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-5 py-3 border text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-5 py-3 border text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white text-lg py-3 rounded-xl hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-md text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
