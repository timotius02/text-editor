import clsx from "clsx";

const Leaf = (props: any) => {
  const { leaf } = props;
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
      className={clsx(
        "bg-gray-300 font-mono",
        leaf.comment && "text-slate-400",
        (leaf.operator || leaf.url) && "text-amber-600",
        leaf.keyword && "text-blue-400",
        (leaf.variable || leaf.regex) && "text-orange-300",
        (leaf.number ||
          leaf.boolean ||
          leaf.tag ||
          leaf.constant ||
          leaf.symbol ||
          leaf["attr-name"] ||
          leaf.selector) &&
          "text-rose-900",
        leaf.punctuation && "text-gray-400",
        (leaf.string || leaf.char) && "text-lime-600",
        (leaf.function || leaf["class-name"]) && "text-red-400"
      )}
    >
      {props.children}
    </span>
  );
};

export default Leaf;
