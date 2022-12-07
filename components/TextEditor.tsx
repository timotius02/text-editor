import { useState, useCallback } from "react";
import {
  createEditor,
  Descendant,
  Text,
  NodeEntry,
  BaseRange,
  Node,
  Range,
  Editor,
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
import { CodeBlockElement } from "../lib/slate";
import ElementSwitch from "./ElementSwitch";
import { Toolbar } from "./Toolbar/Toolbar";
import MarkButton from "./Toolbar/MarkButton";
import Prism from "prismjs";

import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import {
  deleteCodeBlock,
  getBlock,
  insertCodeLine,
  isBlockActive,
  toggleCodeBlock,
} from "../lib/utils";
import BlockButton from "./Toolbar/BlockButton";

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

    const codeBlock = getBlock<CodeBlockElement>(editor, "code-block", path);
    if (codeBlock) {
      const tokens = Prism.tokenize(
        Node.string(node),
        Prism.languages[codeBlock.language ?? "javascript"]
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

    const res = getBlock(editor, "code-line");
    if (!res) return;

    insertCodeLine(editor);
    return true;
  };

  editor.insertBreak = () => {
    if (insertLineBreakForCode()) return;
    insertBreak();
  };

  // Handle backspace deletion of empty code block
  const { deleteBackward } = editor;
  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (
      selection &&
      selection.focus.offset === 0 &&
      selection.anchor.offset === 0 &&
      Range.isCollapsed(selection)
    ) {
      deleteCodeBlock(editor);
      deleteBackward(unit);
    } else {
      deleteBackward(unit);
    }
  };

  return (
    <Slate editor={editor} value={initialValue}>
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
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
          } else if (
            event.key === "Tab" &&
            isBlockActive(editor, "code-block")
          ) {
            event.preventDefault();
            Editor.insertText(editor, "  ");
          }
        }}
      />
    </Slate>
  );
};

export default TextEditor;
