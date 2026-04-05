import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login, isLoading, error, clearError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    try {
      await login(email.trim().toLowerCase(), password);
      setSuccessMessage("connexion réussie, redirection...");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige py-12 px-4 text-brownBlack">
      <div className="w-full max-w-md bg-warmWhite rounded-lg shadow-md p-8 ">
        <h2 className="text-3xl font-bold text-brownBlack text-center mb-6">Connexion</h2>

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

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium"
            >
              Email
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2.5 text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {showPassword ?  <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-fit px-4 py-2 cursor-pointer self-center bg-darkBrown text-white rounded-4xl hover:scale-110 transform transition-transform hover:bg-mediumGreen disabled:opacity-50"
          >
            {isLoading ? "Connexion en cours..." : "Connexion"}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center text-sm">
          <div>
            <a
              href="/mot-de-passe-oublie"
              className="text-brown hover:text-mediumGreen transition-colors"
            >
              Mot de passe oublié?
            </a>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}
