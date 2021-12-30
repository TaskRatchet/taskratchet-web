import React from 'react';
import './Field.css';

interface InputProps {
	label: string;
	id: string;
	error?: string;
	children: React.ReactNode;
}

const Field = ({ label, id, error, children }: InputProps): JSX.Element => {
	return (
		<div
			className={`molecule-field ${error ? 'molecule-field__hasError' : ''}`}
		>
			<label htmlFor={id}>{label}</label>
			{children}
			{error ? <div className={'molecule-field__error'}>{error}</div> : ''}
		</div>
	);
};

export default Field;
