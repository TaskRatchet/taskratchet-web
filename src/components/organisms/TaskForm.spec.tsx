import TaskForm from './TaskForm';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFormProps } from './TaskForm';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vi, expect, it, describe } from 'vitest';

vi.mock('../../lib/Browser');
vi.mock('@mui/x-date-pickers');

global.document.createRange = () =>
	({
		setStart: () => undefined,
		setEnd: () => undefined,
		commonAncestorContainer: {
			nodeName: 'BODY',
			ownerDocument: document,
		},
	} as unknown as Range);

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

describe('TaskForm', () => {
	it('calls onChange when task modified', async () => {
		const onChange = vi.fn();
		const due = '1/1/2022, 11:59 PM';

		renderComponent({ onChange, due });

		userEvent.type(await screen.findByText(/Task/), 'a');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				task: 'a',
				due,
				cents: 500,
			})
		);
	});

	it('calls onChange when due modified', async () => {
		const onChange = vi.fn();

		renderComponent({ onChange });

		userEvent.type(
			await screen.findByLabelText('Due Time *'),
			'{backspace}{backspace}am'
		);

		expect(onChange).toBeCalled();
	});

	it('calls onChange when cents modified', () => {
		const onChange = vi.fn();

		renderComponent({ onChange });

		userEvent.type(screen.getByLabelText('Stakes *'), '1');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				cents: 5100,
			})
		);
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
			task: 'the_task',
			due: '1/1/2020 11:59 PM',
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
