import { useState, useCallback, useEffect } from "react";
import {
  createEditor,
  Descendant,
  Text,
  Editor,
  Transforms,
  Element,
  NodeEntry,
  BaseRange,
  Node,
  Path,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";
import { withHistory } from "slate-history";

import Leaf from "./Leaf";
import { CodeBlockElement, CustomEditor } from "../lib/slate";
import ElementSwitch from "./ElementSwitch";
import { Toolbar } from "./Toolbar/Toolbar";
import MarkButton from "./Toolbar/MarkButton";
import Prism from "prismjs";

import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import { getBlock } from "../lib/utils";
import BlockButton from "./Toolbar/BlockButton";

// const EditorActions = {
//   getCodeBlock(editor: CustomEditor, path?: Path): CodeBlockElement | null {
//     const [match] = Editor.nodes(editor, {
//       match: (n) => Element.isElement(n) && n.type === "code-block",
//       at: path,
//     });

//     if (
//       match &&
//       Element.isElement(match[0]) &&
//       match[0].type === "code-block"
//     ) {
//       return match[0];
//     } else return null;
//   },
//   toggleCodeBlock(editor: CustomEditor, path?: Path) {
//     const [match] = Editor.nodes(editor, {
//       match: (n) => Element.isElement(n) && n.type === "code-block",
//       at: path,
//     });
//     Transforms.setNodes(
//       editor,
//       match
//         ? { type: "paragraph" }
//         : { type: "code-block", language: "javascript" },
//       { match: (n) => Editor.isBlock(editor, n) }
//     );
//   },
// };

const getLength = (token: string | Prism.Token): number => {
  if (typeof token === "string") {
    return token.length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  } else if (Array.isArray(token.content)) {
    return token.content.reduce((l, t) => l + getLength(t), 0);
  } else {
    throw new Error("Code highlight cannot have non-text content");
  }
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "code-block",
    language: "js",
    children: [{ text: "const t = hello" }],
  },
];

const TextEditor = () => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const renderElement = useCallback(
    (props: RenderElementProps) => <ElementSwitch {...props} />,
    []
  );

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const decorate = ([node, path]: NodeEntry<Node>) => {
    const ranges: BaseRange[] = [];
    if (!Text.isText(node)) {
      return ranges;
    }
    const codeBlock = getBlock(editor, "code-block", path);

    if (codeBlock && codeBlock.type === "code-block") {
      const tokens = Prism.tokenize(
        node.text,
        Prism.languages[codeBlock.language]
      );
      let start = 0;

      for (const token of tokens) {
        const length = getLength(token);
        const end = start + length;

        if (typeof token !== "string") {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          });
        }

        start = end;
      }
    }
    return ranges;
  };

  // Handle inserting New lines in Code block
  const { insertBreak } = editor;
  const insertLineBreakForCode = () => {
    if (!editor.selection) return;

    const res = getBlock(editor, "code-block");
    if (!res) return;

    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [{ text: "" }],
    });

    return true;
  };

  editor.insertBreak = () => {
    if (insertLineBreakForCode()) return;
    insertBreak();
  };

  function toggleCodeBlock(
    editor: import("slate").BaseEditor &
      import("slate-react").ReactEditor &
      import("slate-history").HistoryEditor
  ) {
    throw new Error("Function not implemented.");
  }

  return (
    <Slate editor={editor} value={initialValue}>
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        {/* <MarkButton format="code" icon="code" /> */}

        <BlockButton format="code-block" icon="code" />
      </Toolbar>
      <Editable
        className="h-full"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Type Something..."
        autoFocus={true}
        spellCheck={false}
        decorate={decorate}
        onKeyDown={(event) => {
          if (event.key === "`" && event.ctrlKey) {
            event.preventDefault();
            toggleCodeBlock(editor);
          }
        }}
      />
    </Slate>
  );
};

export default TextEditor;
