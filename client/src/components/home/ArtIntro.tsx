import type { GalleryIntroSectionData } from "../../api/contentAPI";
import { SectionIntro } from "./SectionIntro";

interface ArtIntroProps {
  data: GalleryIntroSectionData;
}

export function ArtIntro({ data }: ArtIntroProps) {
  return <SectionIntro data={data} />;
}
