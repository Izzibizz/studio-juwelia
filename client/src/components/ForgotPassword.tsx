import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const navigate = useNavigate();

  const { requestPasswordReset, isLoading, error, clearError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    try {
      await requestPasswordReset(email.trim().toLowerCase());
      setShowEmail(true);
      setSuccessMessage(
        "Check your email for a password reset link. It will expire in 1 hour.",
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-4">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {!showEmail ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : null}

        <div className="mt-6 text-center text-sm space-y-2">
          <div>
            <a href="/login" className="text-blue-600 hover:text-blue-800">
              Back to Login
            </a>
          </div>
          <div>
            <a href="/signup" className="text-blue-600 hover:text-blue-800">
              Create a new account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
