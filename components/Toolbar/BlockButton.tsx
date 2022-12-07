import { useSlate } from "slate-react";
import { CustomElement } from "../../lib/slate";
import { isBlockActive, toggleCodeBlock } from "../../lib/utils";
import { Button } from "./Button";
import { Icon } from "./Icon";

type BlockButtonParams = {
  format: CustomElement["type"];
  icon: string;
};

const BlockButton = ({ format, icon }: BlockButtonParams) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event: Event) => {
        event.preventDefault();
        toggleCodeBlock(editor);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export default BlockButton;
