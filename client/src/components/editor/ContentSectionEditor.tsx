import { EditorField } from "./EditorField";
import type { EditorFieldDefinition } from "../../editorSchemas/types";

interface ContentSectionEditorProps {
  title: string;
  fields: Record<string, EditorFieldDefinition>;
  value: Record<string, string | undefined>;
  onChange: (nextValue: Record<string, string>) => void;
}

export function ContentSectionEditor({
  title,
  fields,
  value,
  onChange,
}: ContentSectionEditorProps) {
  const handleFieldChange = (fieldKey: string, fieldValue: string) => {
    onChange({
      ...Object.fromEntries(
        Object.entries(value).map(([key, currentValue]) => [
          key,
          currentValue || "",
        ]),
      ),
      [fieldKey]: fieldValue,
    });
  };

  return (
    <section className="rounded-2xl border border-[#e7dfd5] bg-[#f8f4ee] p-5">
      <h3 className="mb-4 text-lg font-bold text-darkBrown">{title}</h3>
      <div className="grid gap-4">
        {Object.entries(fields).map(([fieldKey, definition]) => (
          <EditorField
            key={fieldKey}
            type={definition.type}
            label={definition.label}
            value={value[fieldKey] || ""}
            onChange={(nextValue) => handleFieldChange(fieldKey, nextValue)}
            placeholder={definition.placeholder}
            multiline={definition.multiline}
          />
        ))}
      </div>
    </section>
  );
}
