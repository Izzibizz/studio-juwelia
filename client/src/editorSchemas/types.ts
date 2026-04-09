import type { EditorFieldType } from "../components/editor/EditorField";

export interface EditorFieldDefinition {
  label: string;
  type: EditorFieldType;
  placeholder?: string;
  multiline?: boolean;
}

export type SectionEditorSchema = Record<string, EditorFieldDefinition>;
export type PageEditorSchema = Record<string, SectionEditorSchema>;
