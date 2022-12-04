import { DefaultElement } from "slate-react";
import CodeElement from "./CodeElement";

export default function ElementSwitch(props: any) {
  const { attributes, children, ...rest } = props;

  switch (props.element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "code":
      return <CodeElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}
