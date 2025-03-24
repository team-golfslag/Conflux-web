import {Input} from "@/components/ui/input.tsx";
import {ComponentProps, useId} from "react";
import {Label} from "@/components/ui/label.tsx";

type LabeledInputProps = ComponentProps<"input"> & {
    label: string
}

const LabeledInput = (props: LabeledInputProps) => {

    const inputId = useId();

    return <div>
        <Label htmlFor={inputId} className="mb-1">{props.label}</Label>
        <Input id={inputId} {...props} />
    </div>
}

export default LabeledInput