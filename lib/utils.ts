import { Path, Element, Editor, Transforms } from "slate";
import { CustomEditor, CustomElement } from "./slate";

/**
 * Returns the nearest containing block with `type`
 * @param editor CustomEditor
 * @param type type of block
 * @param path Path to location if not searching from cursor
 * @returns CustomElement
 */
export function getBlock<T extends CustomElement["type"]>(
  editor: CustomEditor,
  type: T,
  path?: Path
) {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === type,
    at: path,
  });

  if (match && Element.isElement(match[0]) && match[0].type === type) {
    return match[0];
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
