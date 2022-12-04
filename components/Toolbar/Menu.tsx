import clsx from "clsx";
import React, { type Ref } from "react";
import { BasePropsWithChildren } from "./types";

const Menu = React.forwardRef(
  (
    { className, ...props }: BasePropsWithChildren,
    ref: Ref<HTMLDivElement>
  ) => <div {...props} ref={ref} className={clsx(className)} />
);

Menu.displayName = "Menu";

export default Menu;
