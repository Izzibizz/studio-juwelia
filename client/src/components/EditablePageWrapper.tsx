import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { EditorField } from "./editor";
import type { EditorFieldType } from "./editor";

interface EditablePageWrapperProps {
  pageName: string;
  children: React.ReactNode;
  onSave?: (data: Record<string, unknown>) => void;
  editorType?: EditorFieldType;
  initialValue?: string;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
}

export function EditablePageWrapper({
  pageName,
  children,
  onSave,
  editorType = "plain",
  initialValue = "",
  label = "Content",
  placeholder = "Edit page content here...",
  multiline = false,
}: EditablePageWrapperProps) {
  const { isAuthenticated } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(initialValue);

  useEffect(() => {
    if (!isAuthenticated && editMode) {
      setEditMode(false);
    }
  }, [isAuthenticated, editMode]);

  useEffect(() => {
    setEditText(initialValue);
  }, [initialValue]);

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
          className="fixed top-24 right-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          {editMode ? "Cancel" : "Edit Page"}
        </button>
      )}

      {editMode && isAuthenticated ? (
        <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-6">
          <EditorField
            type={editorType}
            label={label}
            value={editText}
            onChange={setEditText}
            placeholder={placeholder}
            multiline={multiline}
          />
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSave}
              className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="rounded-lg bg-gray-400 px-6 py-2 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {children}
          {isAuthenticated && !editMode && (
            <div className="mt-6 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900">
              ℹ️ Click the "Edit Page" button to modify this page's content.
            </div>
          )}
        </>
      )}
    </div>
  );
}
