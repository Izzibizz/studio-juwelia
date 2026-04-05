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
        "Verifiez votre email pour le lien de reinitialisation. Il expire dans 1 heure.",
      );
      setTimeout(() => navigate("/connexion"), 3000);
    } catch {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige py-12 px-4 text-brownBlack">
      <div className="w-full max-w-md bg-warmWhite rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-brownBlack">
          Reinitialiser le mot de passe
        </h2>
        <p className="text-center text-brown mb-6">
          Entrez votre email et nous vous enverrons un lien pour reinitialiser
          votre mot de passe.
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
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="vous@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-fit px-4 py-2 cursor-pointer self-center bg-darkBrown text-white rounded-4xl hover:scale-110 transform transition-transform hover:bg-mediumGreen disabled:opacity-50"
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </form>
        ) : null}

        <div className="mt-6 text-center text-sm space-y-2">
          <div>
            <a
              href="/connexion"
              className="text-brown hover:text-mediumGreen transition-colors"
            >
              Retour a la connexion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
