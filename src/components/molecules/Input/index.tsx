import React, {ChangeEvent, ChangeEventHandler} from "react";

interface InputProps {
    label: string,
    type?: string,
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    id: string
}

const Input = ({label, type="text", value, onChange, id}: InputProps) => {
    return <div className={'molecule-input'}>
        <label htmlFor={id}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            id={id}
            name={id}
        />
    </div>
}

export default Input