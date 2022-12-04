"use client";

// import Prism from "prismjs";
// import "prismjs/components/prism-python";
// import "prismjs/components/prism-php";
// import "prismjs/components/prism-sql";
// import "prismjs/components/prism-java";
import { useState, useCallback, useMemo } from "react";
import {
  BaseRange,
  createEditor,
  Descendant,
  type NodeEntry,
  Text,
  type Node,
  Editor,
  Element,
  Transforms,
  BaseEditor,
} from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import Leaf from "./Leaf";
import CodeElement from "./CodeElement";
import DefaultElement from "./DefaultElement";
import { CustomEditor } from "../lib/slate";

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

const CustomEditor = {
  isBoldMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.bold === true,
      universal: true,
    });

    return !!match;
  },

  isCodeBlockActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "code",
    });

    return !!match;
  },

  toggleBoldMark(editor: BaseEditor & ReactEditor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor: BaseEditor & ReactEditor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? undefined : "code" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const TextEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          // Replace the `onKeyDown` logic with our new commands.
          switch (event.key) {
            case "`": {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              break;
            }

            case "b": {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

export default TextEditor;
