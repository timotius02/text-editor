import { PropsWithChildren } from "react";
import { BaseProps } from "./types";

export const Button = ({
  className,
  active,
  reversed,
  ...props
}: PropsWithChildren<
  {
    active: boolean;
  } & BaseProps
>) => (
  <button>
    <span
      {...props}
      className={`${className} p-2 ${active ? "text-black" : "text-gray-400"}`}
    />
  </button>
);
