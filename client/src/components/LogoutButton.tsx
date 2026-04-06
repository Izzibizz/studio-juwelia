import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={async () => {
        await logout();
        navigate("/");
      }}
      className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-darkBrown hover:bg-white text-white hover:text-darkBrown hover:scale-110 transform transition-all duration-200 rounded-4xl text-sm cursor-pointer font-sans shadow-lg"
    >
      Déconnecter
    </button>
  );
};
