import { DefaultElement, RenderElementProps } from "slate-react";
import CodeElement from "./CodeElement";

export default function ElementSwitch(props: RenderElementProps) {
  const { attributes, children } = props;

  switch (props.element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "code-block":
      return <CodeElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}
