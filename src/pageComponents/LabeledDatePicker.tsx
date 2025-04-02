import {useId} from "react";
import {Label} from "@/components/ui/label.tsx";
import {DatePicker, DatePickerProps} from "@/components/ui/datepicker.tsx";

type LabeledDatePickerProps = DatePickerProps & {
    label: string
}

const LabeledDatePicker = (props: LabeledDatePickerProps) => {

    const inputId = useId();

    return <div>
        <Label htmlFor={inputId} className="mb-1">{props.label}</Label>
        <DatePicker id={inputId} {...props} />
    </div>
}

export default LabeledDatePicker