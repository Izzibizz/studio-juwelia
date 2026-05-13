import DOMPurify from "dompurify";

interface RichTextContentProps {
  html: string;
  className?: string;
}

export function RichTextContent({
  html,
  className = "",
}: RichTextContentProps) {
  const sanitizedHtml = DOMPurify.sanitize(html || "");

  return (
    <div
      className={`[&_p]:mb-6 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
