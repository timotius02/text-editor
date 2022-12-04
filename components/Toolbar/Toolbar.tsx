import React, { PropsWithChildren } from "react";
import Menu from "./Menu";
import { BasePropsWithChildren } from "./types";

export const Toolbar = ({ className, ...props }: BasePropsWithChildren) => (
  <Menu
    {...props}
    className={`${className} mb-5 border-b-2 border-gray-200 px-3 pb-3`}
  />
);
