import type { GalleryIntroSectionData } from "../../api/contentAPI";
import { SectionIntro } from "./SectionIntro";

interface TattooIntroProps {
  data: GalleryIntroSectionData;
  isEditing?: boolean;
  onChange?: (nextData: GalleryIntroSectionData) => void;
  onUploadImage?: (index: number, file: File) => Promise<void>;
  onAddImageUpload?: (file: File) => Promise<void>;
  onRemoveImage?: (index: number) => void;
}

export function TattooIntro(props: TattooIntroProps) {
  return <SectionIntro {...props} />;
}
