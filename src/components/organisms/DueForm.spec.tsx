import { render, screen } from '@testing-library/react';
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

	return render(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<TaskForm {...p} />
		</LocalizationProvider>
	);
};

describe('due form', () => {
	it('calls onChange when due modified', async () => {
		const onChange = vi.fn();

		renderComponent({ onChange });

		userEvent.type(
			await screen.findByLabelText('Due Time *'),
			'{backspace}{backspace}am'
		);

		expect(onChange).toBeCalled();
	});

	it('preserves time when editing date', () => {
		const onChange = vi.fn();

		renderComponent({
			due: '1/1/2021, 11:59 PM',
			cents: 500,
			onChange,
		});

		userEvent.type(screen.getByLabelText('Due Date *'), '{backspace}2{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				due: '1/1/2022, 11:59 PM',
			})
		);
	});

	it('preserves date when editing time', () => {
		const onChange = vi.fn();

		renderComponent({
			due: '1/1/2020, 11:59 PM',
			cents: 500,
			onChange,
		});

		userEvent.type(screen.getByLabelText('Due Time *'), '{backspace}M{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				due: '1/1/2020, 11:59 PM',
			})
		);
	});
});
