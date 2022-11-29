import { render, screen } from '@testing-library/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
		onCancel: () => undefined,
		isLoading: false,
		...props,
	};

	return render(
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<TaskForm {...p} />
		</LocalizationProvider>
	);
};

describe('due form', () => {
	it('calls onChange when due modified', async () => {
		const onChange = vi.fn();

		renderComponent({ onChange });

		await userEvent.type(
			await screen.findByLabelText('Due Time *'),
			'{backspace}{backspace}am'
		);

		expect(onChange).toBeCalled();
	});

	it('preserves time when editing date', async () => {
		const onChange = vi.fn();

		renderComponent({
			due: '1/1/2021, 11:59 PM',
			cents: 500,
			onChange,
		});

		await userEvent.type(
			screen.getByLabelText('Due Date *'),
			'{backspace}2{enter}'
		);

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				due: '1/1/2022, 11:59 PM',
			})
		);
	});

	it('preserves date when editing time', async () => {
		const onChange = vi.fn();

		renderComponent({
			due: '1/1/2020, 11:59 PM',
			cents: 500,
			onChange,
		});

		await userEvent.type(
			screen.getByLabelText('Due Time *'),
			'{backspace}M{enter}'
		);

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				due: '1/1/2020, 11:59 PM',
			})
		);
	});
});
