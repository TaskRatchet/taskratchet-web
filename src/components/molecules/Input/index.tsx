import React, {ChangeEvent, ChangeEventHandler} from "react";
import './style.css';

interface InputProps {
    label: string,
    type?: string,
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    id: string
    error?: string
}

const Input = ({label, type="text", value, onChange, id, error}: InputProps) => {
    return <div className={`molecule-input ${error ? 'molecule-input__hasError' : ''}`}>
        <label htmlFor={id}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            id={id}
            name={id}
        />
        {error ? <div className={'molecule-input__error'}>{error}</div> : ''}
    </div>
}

export default Input