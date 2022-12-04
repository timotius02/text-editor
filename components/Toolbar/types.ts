import { PropsWithChildren } from "react";

export interface BaseProps {
  className?: string;
  [key: string]: unknown;
}

export type BasePropsWithChildren = PropsWithChildren<BaseProps>;
