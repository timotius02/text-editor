import clsx from "clsx";

interface LeafProps {
  attributes: any;
  children: React.ReactNode;
  leaf: any;
}
const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  return (
    <span
      {...attributes}
      className={clsx(
        "font-mono bg-gray-300",
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
      {children}
    </span>
  );
};

export default Leaf;
