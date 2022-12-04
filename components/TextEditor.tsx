import { useState, useCallback } from "react";
import {
  createEditor,
  Descendant,
  Text,
  Editor,
  Transforms,
  Element,
} from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import Leaf from "./Leaf";
import { CustomEditor, FormattedText } from "../lib/slate";
import ElementSwitch from "./ElementSwitch";
import { Toolbar } from "./Toolbar/Toolbar";
import MarkButton from "./Toolbar/MarkButton";

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

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const TextEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback(
    (props: any) => <ElementSwitch {...props} />,
    []
  );

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
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
      />
    </Slate>
  );
};

export default TextEditor;
