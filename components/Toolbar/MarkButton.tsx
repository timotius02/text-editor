import { useSlate } from "slate-react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { isMarkActive, toggleMark } from "../../lib/utils";

const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: Event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export default MarkButton;
