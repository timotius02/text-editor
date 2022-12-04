import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type CodeElement = {
  type: "code";
  children: string;
};

export type CustomElement = ParagraphElement | HeadingElement | CodeElement;

export type FormattedText = { text: string; bold?: true };

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
