import { PlainTextInput } from "./PlainTextInput";
import { RichTextEditor } from "./RichTextEditor";

export type EditorFieldType = "plain" | "rich";

interface EditorFieldProps {
  type: EditorFieldType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function EditorField({
  type,
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: EditorFieldProps) {
  if (type === "rich") {
    return (
      <RichTextEditor
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  }

  return (
    <PlainTextInput
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      multiline={multiline}
    />
  );
}
