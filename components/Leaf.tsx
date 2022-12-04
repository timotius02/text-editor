import { RenderLeafProps } from "slate-react";

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underline ? "underline" : "initial",
        fontFamily: props.leaf.code ? "monospace" : "inherit",
        backgroundColor: props.leaf.code ? "#eee" : "inherit",
        padding: props.leaf.code ? "3px" : undefined,
      }}
    >
      {props.children}
    </span>
  );
};

export default Leaf;
