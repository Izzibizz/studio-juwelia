import type { GalleryIntroSectionData } from "../../api/contentAPI";
import { SectionIntro } from "./SectionIntro";

interface TattooIntroProps {
  data: GalleryIntroSectionData;
}

export function TattooIntro({ data }: TattooIntroProps) {
  return <SectionIntro data={data} />;
}
