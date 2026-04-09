import type { PageEditorSchema } from "./types";
import { aboutEditorSchema } from "./aboutEditorSchema";
import { artEditorSchema } from "./artEditorSchema";
import { bookingEditorSchema } from "./bookingEditorSchema";
import { contactEditorSchema } from "./contactEditorSchema";
import { homeEditorSchema } from "./homeEditorSchema";
import { sharedEditorSchema } from "./sharedEditorSchema";
import { tattoosEditorSchema } from "./tattoosEditorSchema";

export { homeEditorSchema } from "./homeEditorSchema";
export type {
  EditorFieldDefinition,
  PageEditorSchema,
  SectionEditorSchema,
} from "./types";

export const pageEditorSchemas: Record<string, PageEditorSchema> = {
  homepage: homeEditorSchema,
  shared: sharedEditorSchema,
  about: aboutEditorSchema,
  art: artEditorSchema,
  booking: bookingEditorSchema,
  contact: contactEditorSchema,
  tattoos: tattoosEditorSchema,
};
