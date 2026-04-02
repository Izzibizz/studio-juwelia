import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

interface EditablePageWrapperProps {
  pageName: string;
  children: React.ReactNode;
  onSave?: (data: Record<string, unknown>) => void;
}

export function EditablePageWrapper({
  pageName,
  children,
  onSave,
}: EditablePageWrapperProps) {
  const { isAuthenticated } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    // Reset edit mode when user logs out
    if (!isAuthenticated && editMode) {
      setEditMode(false);
    }
  }, [isAuthenticated, editMode]);

  const handleEditClick = () => {
    if (isAuthenticated) {
      setEditMode(!editMode);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave({ [pageName]: editText });
      setEditMode(false);
    }
  };

  return (
    <div className="relative">
      {isAuthenticated && (
        <button
          onClick={handleEditClick}
          className="fixed top-24 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {editMode ? "Cancel" : "Edit Page"}
        </button>
      )}

      {editMode && isAuthenticated ? (
        <div className="p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono"
            placeholder="Edit page content here..."
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {children}
          {isAuthenticated && !editMode && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-lg text-sm text-blue-900">
              ℹ️ Click the "Edit Page" button to modify this page's content.
            </div>
          )}
        </>
      )}
    </div>
  );
}
