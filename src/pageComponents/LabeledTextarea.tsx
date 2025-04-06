/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { ComponentProps, useId } from "react";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

type LabeledTextareaProps = ComponentProps<"textarea"> & {
  label: string;
};

const LabeledTextarea = (props: LabeledTextareaProps) => {
  const inputId = useId();

  return (
    <div>
      <Label htmlFor={inputId} className="mb-1">
        {props.label}
      </Label>
      <Textarea id={inputId} {...props} />
    </div>
  );
};

export default LabeledTextarea;
