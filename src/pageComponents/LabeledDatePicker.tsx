/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { useId } from "react";
import { Label } from "@/components/ui/label.tsx";
import { DatePicker, DatePickerProps } from "@/components/ui/datepicker.tsx";

type LabeledDatePickerProps = DatePickerProps & {
  label: string;
};

const LabeledDatePicker = (props: LabeledDatePickerProps) => {
  useId();
  return (
    <div>
      <Label className="mb-1">{props.label}</Label>
      <DatePicker {...props} />
    </div>
  );
};

export default LabeledDatePicker;
