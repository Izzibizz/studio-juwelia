interface PlainTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function PlainTextInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: PlainTextInputProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-darkBrown">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] rounded-xl border border-[#d8cfc1] bg-white px-4 py-3 text-brownBlack outline-none focus:border-darkBrown"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="rounded-xl border border-[#d8cfc1] bg-white px-4 py-3 text-brownBlack outline-none focus:border-darkBrown"
        />
      )}
    </label>
  );
}
