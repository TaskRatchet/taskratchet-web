import { render, RenderResult, screen } from '@testing-library/react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import TaskForm, { TaskFormProps } from './TaskForm';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@mui/x-date-pickers');

const renderComponent = (props: Partial<TaskFormProps> = {}) => {
	const p: TaskFormProps = {
		task: '',
		due: '1/1/2022, 11:59 PM',
		cents: 500,
		timezone: '',
		error: '',
		onChange: () => undefined,
		onSubmit: () => undefined,
		isLoading: false,
		...props,
	};

	const view: RenderResult = render(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<TaskForm {...p} />
		</LocalizationProvider>
	);

	return {
		...view,
		taskInput: screen.getByLabelText('Task *'),
		dueDateInput: screen.getByLabelText('Due Date *'),
		dueTimeInput: screen.getByLabelText('Due Time *'),
		centsInput: screen.getByLabelText('Stakes *'),
	};
};

describe('due form', () => {
	it('calls onChange when due modified', () => {
		const onChange = vi.fn();

		const { dueTimeInput } = renderComponent({ onChange });

		userEvent.type(dueTimeInput, '{backspace}{backspace}am');

		expect(onChange).toBeCalled();
	});

	it('preserves time when editing date', () => {
		const onChange = vi.fn();

		const { dueDateInput } = renderComponent({
			due: '1/1/2021, 11:59 PM',
			cents: 500,
			onChange,
		});

		userEvent.type(dueDateInput, '{backspace}2{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				due: '1/1/2022, 11:59 PM',
			})
		);
	});

	it('preserves date when editing time', () => {
		const onChange = vi.fn();

		const { dueTimeInput } = renderComponent({
			due: '1/1/2020, 11:59 PM',
			cents: 500,
			onChange,
		});

		userEvent.type(dueTimeInput, '{backspace}M{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				due: '1/1/2020, 11:59 PM',
			})
		);
	});
});
