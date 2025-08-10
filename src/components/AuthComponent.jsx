import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const AuthComponent = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (result.error) {
        throw result.error;
      }

      if (result.data.user) {
        onAuthSuccess();
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    // Set up demo user session
    const demoUser = {
      id: "demo_user_" + Date.now(),
      email: "demo@iwealthx.com",
      name: "Demo User",
    };

    localStorage.setItem("demo_user", JSON.stringify(demoUser));
    localStorage.setItem("demo_session", "true");

    console.log("Demo mode activated");
    onAuthSuccess();
  };

  const clearSession = async () => {
    // Clear Supabase session
    await supabase.auth.signOut();

    // Clear demo session
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_session");
    localStorage.removeItem("kycCompleted");

    console.log("Session cleared");
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 text-center">
          {isSignUp ? "Create Account" : "Sign In"}
        </h3>
        <p className="text-sm text-gray-600 text-center mt-2">
          {isSignUp
            ? "Create an account to start KYC verification"
            : "Sign in to start KYC verification"}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>

      <div className="mt-6 border-t border-gray-300 pt-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">For testing purposes:</p>
          <button
            type="button"
            onClick={handleDemoMode}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            🚀 Try Demo Mode
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Demo mode allows you to test the KYC flow without creating an
            account
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
