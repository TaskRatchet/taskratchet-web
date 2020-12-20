import React, {ChangeEventHandler} from "react";
import Field from "./Field";

interface InputProps {
    label: string,
    type?: string,
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    id: string
    error?: string
    pattern?: string
}

const Input = ({label, type="text", value, onChange, id, error, pattern}: InputProps) => {
    return <Field label={label} id={id} error={error}>
        <input
            type={type}
            value={value}
            onChange={onChange}
            id={id}
            name={id}
            pattern={pattern}
        />
    </Field>
}

export default Input
