import clsx from "clsx";
import { BasePropsWithChildren } from "./types";

export const Icon = ({ className, ...props }: BasePropsWithChildren) => (
  <span {...props} className={`material-icons text-lg ${className}`} />
);
