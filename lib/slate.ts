import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type BlockQuoteElement = {
  type: "block-quote";
  children: CustomText[];
};

export type CodeBlockElement = {
  type: "code-block";
  language?: string;
  children: CodeLineElement[];
};

export type CodeLineElement = {
  type: "code-line";
  children: FormattedText[];
};
export type CustomElement =
  | ParagraphElement
  | BlockQuoteElement
  | CodeBlockElement
  | CodeLineElement;

export type FormattedText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
  code?: true;
};

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
