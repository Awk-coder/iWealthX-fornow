import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    clearError();

    try {
      const result = await signIn(email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to your iWealthX account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {(error || authError) && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold text-white py-3 rounded-lg font-medium hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            Don't have an account?{" "}
            <Link to="/register" className="text-gold hover:text-opacity-80">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-text-secondary hover:text-gold"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
