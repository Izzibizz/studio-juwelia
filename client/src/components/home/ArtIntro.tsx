import type { GalleryIntroSectionData } from "../../api/contentAPI";
import { SectionIntro } from "./SectionIntro";

interface ArtIntroProps {
  data: GalleryIntroSectionData;
  isEditing?: boolean;
  onChange?: (nextData: GalleryIntroSectionData) => void;
  onUploadImage?: (index: number, file: File) => Promise<void>;
  onAddImageUpload?: (file: File) => Promise<void>;
  onRemoveImage?: (index: number) => void;
}

export function ArtIntro(props: ArtIntroProps) {
  return (
    <SectionIntro
      {...props}
      useSliderLightbox
      swiperVariant="art"
      id="artIntro"
    />
  );
}
