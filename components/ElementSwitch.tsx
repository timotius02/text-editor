import { DefaultElement, RenderElementProps } from "slate-react";
import BlockQuoteElement from "./BlockQuoteElement";
import CodeElement from "./CodeElement";
import CodeLineElement from "./CodeLineElement";

export default function ElementSwitch(props: RenderElementProps) {
  const { attributes, children } = props;

  switch (props.element.type) {
    case "block-quote":
      return <BlockQuoteElement {...props} />;
    case "code-block":
      return <CodeElement {...props} />;
    case "code-line":
      return <CodeLineElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}
