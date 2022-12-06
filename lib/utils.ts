import { Path, Element, Editor, Range, Transforms } from "slate";
import { CustomEditor, CustomElement } from "./slate";

/**
 * Returns the nearest containing block with `type`
 * @param editor CustomEditor
 * @param type type of block
 * @param path Path to location if not searching from cursor
 * @returns CustomElement
 */
export function getBlock<T extends CustomElement>(
  editor: CustomEditor,
  type: T["type"],
  path?: Path
): T | null {
  const { selection } = editor;
  if (!selection) return null;

  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === type,
    at: path,
  });

  if (match && Element.isElement(match[0]) && match[0].type === type) {
    return match[0] as T;
  } else return null;
}

export function isBlockActive(
  editor: CustomEditor,
  format: CustomElement["type"]
) {
  const match = getBlock(editor, format);

  return !!match;
}

function activateElement(type: CustomElement["type"]) {
  switch (type) {
    case "code-block":
      return { type: "code-block", language: "javascript" } as const;
    case "block-quote":
      return { type: "block-quote" } as const;
    default:
      return { type: "paragraph" } as const;
  }
}

/**
 * Toggles the block
 * @param editor CustomEditor
 * @param type type of block
 * @param path Path to location if not searching from cursor
 */
export function toggleBlock<T extends CustomElement["type"]>(
  editor: CustomEditor,
  type: T,
  path?: Path
) {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === type,
    at: path,
  });
  Transforms.setNodes(
    editor,
    match ? { type: "paragraph" } : activateElement(type),
    { match: (n) => Editor.isBlock(editor, n) }
  );
}

export const insertCodeBlock = (editor: CustomEditor) => {
  const { selection } = editor;
  if (
    !selection ||
    Range.isExpanded(selection) ||
    isBlockActive(editor, "code-block")
  )
    return;

  // Adds an extra line before code block if we're at the start
  const path = Editor.above(editor)?.[1];
  if (!(path && Editor.isStart(editor, selection.focus, path))) {
    editor.insertBreak();
  }

  Transforms.setNodes(editor, {
    type: "code-line",
    children: [{ text: "" }],
  });

  Transforms.wrapNodes(editor, {
    type: "code-block",
    children: [],
  });
};

export const insertEmptyCodeBlock = (editor: CustomEditor) => {
  if (!editor.selection) return;

  if (Range.isExpanded(editor.selection) || !Editor.above(editor)) {
    const selectionPath = Editor.path(editor, editor.selection);
    const insertPath = Path.next(selectionPath.slice(0, 1));
    Transforms.insertNodes(
      editor,
      { type: "paragraph", children: [{ text: "" }] },
      {
        at: insertPath,
        select: true,
      }
    );
  }
  insertCodeBlock(editor);
};

export const insertCodeLine = (editor: CustomEditor) => {
  if (editor.selection) {
    Transforms.insertNodes(editor, {
      type: "code-line",
      children: [{ text: "" }],
    });
  }
};

export const deleteCodeBlock = (editor: CustomEditor) => {
  if (!editor.selection) return;

  const node = editor.children[editor.selection.anchor.path[0]];
  if (
    Element.isElement(node) &&
    node.type === "code-block" &&
    node.children.length === 1
  ) {
    Transforms.removeNodes(editor, {
      match: (node) => Element.isElement(node) && node.type === "code-block",
    });
  }
};
