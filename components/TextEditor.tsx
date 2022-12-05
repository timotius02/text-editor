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
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";
import Leaf from "./Leaf";
import { CodeBlockElement, CustomEditor } from "../lib/slate";
import ElementSwitch from "./ElementSwitch";
import { Toolbar } from "./Toolbar/Toolbar";
import MarkButton from "./Toolbar/MarkButton";
import Prism from "prismjs";

const EditorActions = {
  isBoldMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.bold === true,
      universal: true,
    });

    return !!match;
  },

  isCodeBlockActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "code-block",
    });

    return !!match;
  },

  toggleBoldMark(editor: CustomEditor) {
    const isActive = EditorActions.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor: CustomEditor) {
    const isActive = EditorActions.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? undefined : "code-block" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

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
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback(
    (props: RenderElementProps) => <ElementSwitch {...props} />,
    []
  );

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const decorate = useCallback(([node, path]: NodeEntry<Node>) => {
    const ranges: BaseRange[] = [];
    if (!Text.isText(node)) {
      return ranges;
    }
    if (Element.isElement(node)) {
      console.log(node.type);
    }

    if (Element.isElement(node) && node.type === "code-block") {
      const tokens = Prism.tokenize(node.text, Prism.languages["javascript"]);
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

      return ranges;
    } else {
      return ranges;
    }
  }, []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
      </Toolbar>
      <Editable
        className="h-full"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Type Something..."
        autoFocus={true}
        decorate={decorate}
        onKeyDown={(event) => {
          if (event.key === "`" && event.ctrlKey) {
            // Prevent the "`" from being inserted by default.
            event.preventDefault();
            // Otherwise, set the currently selected blocks type to "code".
            Transforms.setNodes(
              editor,
              { type: "code-block", language: "javascript" },
              { match: (n) => Editor.isBlock(editor, n) }
            );
          } else if (event.key === "0") {
            console.log(editor);
          }
        }}
      />
    </Slate>
  );
};

export default TextEditor;
