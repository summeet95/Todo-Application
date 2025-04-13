import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Login to Your Account
        </h2>
        <form className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 border text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 border text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-md text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
