import { useState, type ChangeEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";

interface InlineUploadButtonProps {
  label: string;
  onUpload: (file: File) => Promise<void>;
}

export function InlineUploadButton({
  label,
  onUpload,
}: InlineUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-current px-3 py-2 text-xs font-semibold transition hover:opacity-80">
      <FiUploadCloud size={14} />
      <span>{isUploading ? "Upload..." : label}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={isUploading}
        onChange={(event) => void handleChange(event)}
      />
    </label>
  );
}
