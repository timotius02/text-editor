import { BaseElementProps } from "../types/types";
import Highlight, { defaultProps } from "prism-react-renderer";
import { ChangeEvent, useCallback, useState } from "react";
import { CustomEditor } from "../lib/slate";
import { Transforms, Editor, Element } from "slate";
import { useSlate } from "slate-react";

// const getLength = (token: string | Prism.Token): number => {
//   if (typeof token === "string") {
//     return token.length;
//   } else if (typeof token.content === "string") {
//     return token.content.length;
//   } else if (Array.isArray(token.content)) {
//     return token.content.reduce((l, t) => l + getLength(t), 0);
//   } else {
//     throw new Error("Code highlight cannot have non-text content");
//   }
// };

// const initialValue: Descendant[] = [
//   {
//     type: "paragraph",
//     children: [
//       {
//         text: "<h1>Hi!</h1>",
//       },
//     ],
//   },
// ];

// const TextEditor = () => {
//   const [language, setLanguage] = useState("html");
//   const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
//   const editor = useMemo(() => withReact(createEditor()), []);

//   // decorate function depends on the language selected
//   const decorate = useCallback(
//     ([node, path]: NodeEntry<Node>) => {
//       const ranges: BaseRange[] = [];
//       if (!Text.isText(node)) {
//         return ranges;
//       }
//       const tokens = Prism.tokenize(node.text, Prism.languages[language]);
//       let start = 0;

//       for (const token of tokens) {
//         const length = getLength(token);
//         const end = start + length;

//         if (typeof token !== "string") {
//           ranges.push({
//             [token.type]: true,
//             anchor: { path, offset: start },
//             focus: { path, offset: end },
//           });
//         }

//         start = end;
//       }

//       return ranges;
//     },
//     [language]
//   );

//   return (
//     <div className="mx-auto h-full max-w-4xl bg-white p-8">
//       <Slate editor={editor} value={initialValue}>
//         <div
//           contentEditable={false}
//           style={{ position: "relative", top: "5px", right: "5px" }}
//         >
//           <h3>
//             Select a language
//             <select
//               value={language}
//               style={{ float: "right" }}
//               onChange={(e) => setLanguage(e.target.value)}
//             >
//               <option value="js">JavaScript</option>
//               <option value="css">CSS</option>
//               <option value="html">HTML</option>
//               <option value="python">Python</option>
//               <option value="sql">SQL</option>
//               <option value="java">Java</option>
//               <option value="php">PHP</option>
//             </select>
//           </h3>
//         </div>
//         <Editable
//           decorate={decorate}
//           renderLeaf={renderLeaf}
//           placeholder="Write some code..."
//         />
//       </Slate>
//     </div>
//   );
// };

// interface LeafProps {
//   attributes: any;
//   children: React.ReactNode;
//   leaf: any;
// }
// const Leaf = ({ attributes, children, leaf }: LeafProps) => {
//   return (
//     <span
//       {...attributes}
//       className={clsx(
//         "font-mono bg-gray-300",
//         leaf.comment && "text-slate-400",
//         (leaf.operator || leaf.url) && "text-amber-600",
//         leaf.keyword && "text-blue-400",
//         (leaf.variable || leaf.regex) && "text-orange-300",
//         (leaf.number ||
//           leaf.boolean ||
//           leaf.tag ||
//           leaf.constant ||
//           leaf.symbol ||
//           leaf["attr-name"] ||
//           leaf.selector) &&
//           "text-rose-900",
//         leaf.punctuation && "text-gray-400",
//         (leaf.string || leaf.char) && "text-lime-600",
//         (leaf.function || leaf["class-name"]) && "text-red-400"
//       )}
//     >
//       {children}
//     </span>
//   );
// };

// function isCodeBlockActive(editor: CustomEditor) {
//   const [match] = Editor.nodes(editor, {
//     match: (n) => Element.isElement(n) && n.type === "code-block",
//   });

//   return !!match;
// }

// function toggleCodeBlock(editor: CustomEditor) {
//   const isActive = isCodeBlockActive(editor);
//   Transforms.setNodes(
//     editor,
//     { type: isActive ? undefined : "code-block" },
//     { match: (n) => Editor.isBlock(editor, n) }
//   );
// }

export default function CodeElement(props: BaseElementProps) {
  const [language, setLanguage] = useState("js");
  const editor = useSlate();
  console.log(props);

  const selectLanguage = (value: string) => {
    Transforms.setNodes(
      editor,
      { language: value },
      { match: (n) => Editor.isBlock(editor, n) }
    );
    setLanguage(value);
  };
  return (
    <>
      <select
        value={language}
        style={{ float: "right" }}
        onChange={(e) => selectLanguage(e.target.value)}
      >
        <option value="js">JavaScript</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
        <option value="python">Python</option>
        <option value="sql">SQL</option>
        <option value="java">Java</option>
        <option value="php">PHP</option>
      </select>
      <pre {...props.attributes} className="bg-slate-700 p-2">
        <code className="language-js">{props.children}</code>
      </pre>
    </>
  );
}
