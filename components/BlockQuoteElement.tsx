import { RenderElementProps } from "slate-react";

export default function BlockQuoteElement(props: RenderElementProps) {
  const { attributes, children } = props;
  return (
    <blockquote
      className="text-center text-xl font-semibold italic text-gray-900"
      {...attributes}
    >
      {children}
    </blockquote>
  );
}
