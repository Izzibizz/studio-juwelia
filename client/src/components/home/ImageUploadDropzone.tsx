import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";

interface ImageUploadDropzoneProps {
  label?: string;
  onUpload: (file: File) => Promise<void>;
}

export function ImageUploadDropzone({
  label = "Drop image here or click to upload",
  onUpload,
}: ImageUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      await onUpload(file);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDrop = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  return (
    <label
      className={`flex min-h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition ${
        isDragging
          ? "border-darkBrown bg-beige/50"
          : "border-[#d8cfc1] bg-[#faf7f2] hover:border-darkBrown/60"
      } ${isUploading ? "opacity-70" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => void handleDrop(event)}
    >
      <FiUploadCloud size={18} className="mb-2 text-darkBrown" />
      <span className="text-sm font-semibold text-darkBrown">
        {isUploading ? "Uploading..." : label}
      </span>
      <span className="mt-1 text-xs text-brown">PNG, JPG, WEBP</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={isUploading}
        onChange={(event) => void handleInputChange(event)}
      />
    </label>
  );
}
