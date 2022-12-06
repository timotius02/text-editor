import { RenderElementProps } from "slate-react";

export default function CodeLineElement(props: RenderElementProps) {
  return (
    <p className="text-gray-300" {...props.attributes}>
      {props.children}
    </p>
  );
}
