import { useCallback } from "react";

import { Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSlate } from "slate-react";

export default function CodeElement(props: RenderElementProps) {
  const editor = useSlate();
  const { element } = props;

  if (element.type !== "code-block") {
    throw new Error("Code Element must be rendered with type 'code-block'");
  }

  const selectLanguage = useCallback(
    (value: string) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { language: value }, { at: path });
    },
    [editor, element]
  );
  return (
    <div className="py-2">
      <select
        value={element.language}
        style={{ float: "right" }}
        onChange={(e) => selectLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
        <option value="python">Python</option>
        <option value="sql">SQL</option>
        <option value="java">Java</option>
        <option value="php">PHP</option>
      </select>
      <pre {...props.attributes} className="bg-slate-700 p-2">
        {props.children}
      </pre>
    </div>
  );
}
