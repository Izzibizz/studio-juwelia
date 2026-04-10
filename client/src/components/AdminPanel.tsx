import { useState } from "react";
import { FiCheck, FiEdit2, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useAdminStore } from "../stores/adminStore";

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const { isEditMode, saveAction, setEditMode } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) return null;

  const handleToggleEdit = async () => {
    if (!isEditMode) {
      setEditMode(true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (saveAction) {
        await saveAction();
      }
      setEditMode(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      setEditMode(false);
      await logout();
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col gap-3">
      <button
        onClick={() => void handleToggleEdit()}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-full bg-darkBrown px-5 py-3 font-sans text-sm text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white hover:text-darkBrown disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isEditMode ? <FiCheck size={18} /> : <FiEdit2 size={18} />}
        <span>{isEditMode ? "Termine" : "Editer"}</span>
      </button>
      <button
        onClick={() => void handleLogout()}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-full border border-darkBrown bg-white px-5 py-3 font-sans text-sm text-darkBrown shadow-lg transition-all duration-200 hover:scale-105 hover:bg-darkBrown hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FiLogOut size={18} />
        <span>Deconnecter</span>
      </button>
    </div>
  );
};
