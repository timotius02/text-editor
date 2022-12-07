import { Path, Element, Editor, Range, Transforms, Text } from "slate";
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

/**
 * Checks if block with `type` is active path, which defaults to current selection
 * @param editor CustomEditor
 * @param type type of block
 * @param path Path to location if not searching from cursor
 */
export function isBlockActive(
  editor: CustomEditor,
  type: CustomElement["type"],
  path?: Path
) {
  const match = getBlock(editor, type, path);
  return !!match;
}

function _activateElement(type: CustomElement["type"]) {
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
 * Toggles simple blocks, currently only 'block-quote'
 * @param editor CustomEditor
 * @param type type of block
 * @param path Path to location if not searching from cursor
 */
export function toggleBlock<T extends CustomElement>(
  editor: CustomEditor,
  type: T["type"],
  path?: Path
) {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === type,
    at: path,
  });
  Transforms.setNodes(
    editor,
    match ? { type: "paragraph" } : _activateElement(type),
    { match: (n) => Editor.isBlock(editor, n) }
  );
}

/**
 * Activates/Deactivates Code block.
 * Used in Code block UI Button and ctrl + '`' shortcut
 * @param editor
 */
export function toggleCodeBlock(editor: CustomEditor) {
  if (!editor.selection) return;

  const [isActive] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === "code-block",
  });

  if (isActive) {
    unwrapCodeBlock(editor);
  } else {
    insertCodeBlock(editor);
  }
}

/**
 * Adds a codeblock. Adds an extra line before code block if we are
 * at the very start of the editor.
 * @param editor CustomEditor
 */
export const insertCodeBlock = (editor: CustomEditor) => {
  const { selection } = editor;
  if (!selection || isBlockActive(editor, "code-block")) return;

  // Adds an extra line before code block if we're at the start
  const path = Editor.above(editor)?.[1];
  if (!(path && Editor.isStart(editor, selection.focus, path))) {
    editor.insertBreak();
  }

  wrapCodeBlock(editor);
};

/**
 * Converts already existing elements into code-lines for code block
 * @param editor
 */
export function wrapCodeBlock(editor: CustomEditor) {
  Transforms.setNodes(
    editor,
    { type: "code-line", children: [] },
    { split: true }
  );
  Transforms.wrapNodes(editor, {
    type: "code-block",
    children: [],
  });
}

/**
 *
 * @param editor Converts Code-black back to text
 */
export function unwrapCodeBlock(editor: CustomEditor) {
  Transforms.unwrapNodes(editor, {
    match: (n) => Element.isElement(n) && n.type === "code-block",
    split: true,
  });
  Transforms.setNodes(editor, {
    type: "paragraph",
  });
}

/**
 * Inserts a new code-line in code block. Used when pressing Enter
 * in a code block.
 * @param editor
 */
export const insertCodeLine = (editor: CustomEditor) => {
  if (editor.selection) {
    Transforms.insertNodes(editor, {
      type: "code-line",
      children: [{ text: "" }],
    });
  }
};

/**
 * Delete an empty code block. Used in handling backspace in code-block
 * @param editor
 */
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
