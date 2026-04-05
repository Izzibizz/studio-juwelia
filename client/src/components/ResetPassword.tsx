import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    if (!token) {
      clearError();
      return;
    }

    if (password !== confirmPassword) {
      clearError();
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccessMessage(
        "Mot de passe reinitialise avec succes, redirection...",
      );
      setTimeout(() => navigate("/connexion"), 1500);
    } catch {
      // Error is handled by store
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige py-12 px-4 text-brownBlack">
        <div className="w-full max-w-md bg-warmWhite rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-brownBlack">
            Lien invalide
          </h2>
          <p className="text-center text-brown mb-6">
            Le lien de reinitialisation est invalide ou a expire.
          </p>
          <a
            href="/mot-de-passe-oublie"
            className="block w-fit px-4 py-2 mx-auto cursor-pointer bg-darkBrown text-white rounded-4xl hover:scale-110 transform transition-transform hover:bg-mediumGreen text-center"
          >
            Demander un nouveau lien
          </a>
        </div>
      </div>
    );
  }

  const passwordsMatch = password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige py-12 px-4 text-brownBlack">
      <div className="w-full max-w-md bg-warmWhite rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Definir un nouveau mot de passe
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Nouveau mot de passe
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2.5 text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                confirmPassword && !passwordsMatch
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-600 text-sm mt-1">
                Les mots de passe ne correspondent pas
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordsMatch}
            className="w-fit px-4 py-2 cursor-pointer self-center bg-darkBrown text-white rounded-4xl hover:scale-110 transform transition-transform hover:bg-mediumGreen disabled:opacity-50"
          >
            {isLoading ? "Reinitialisation..." : "Reinitialiser"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a
            href="/connexion"
            className="text-brown hover:text-mediumGreen transition-colors"
          >
            Retour a la connexion
          </a>
        </div>
      </div>
    </div>
  );
}
