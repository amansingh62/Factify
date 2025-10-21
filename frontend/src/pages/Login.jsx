// Imported all required packages
import { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate, Link } from "react-router-dom";

// Function for login
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

// Logic for form submission and error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const res = await axios.post("/auth/signin", form);
      console.log("Login response:", res.data);
      console.log("Login response headers:", res.headers);

      setSuccess(res.data.message || "Login successful");

      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      console.error("Login error response:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-black tracking-tight">
                  <span className="text-gray-400 text-sm font-medium tracking-wide">powered by </span>Factify
                </h1>
              </div>
              <h2 className="text-2xl font-semibold text-black mb-2 tracking-tight">Welcome back</h2>
              <p className="text-gray-500 text-base font-medium">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-base"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-base"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-black hover:text-gray-700 font-semibold transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {success && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-gray-700 text-sm text-center font-medium">{success}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-xl">
                <p className="text-gray-800 text-sm text-center font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
