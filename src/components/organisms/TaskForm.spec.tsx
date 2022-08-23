import TaskForm from './TaskForm';
import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFormProps } from './TaskForm';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vi } from 'vitest';

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

describe('TaskForm', () => {
	it('has task input', () => {
		renderComponent();

		expect(screen.getByLabelText('Task *')).toBeInTheDocument();
	});

	it('calls onChange when task modified', () => {
		const onChange = vi.fn();
		const due = new Date('1/1/2022, 11:59 PM');

		const { taskInput } = renderComponent({ onChange, due });

		userEvent.type(taskInput, 'a');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				task: 'a',
				due,
				cents: 500,
			})
		);
	});

	it('calls onChange when due modified', () => {
		const onChange = vi.fn();

		const { dueTimeInput } = renderComponent({ onChange });

		userEvent.type(dueTimeInput, '{backspace}{backspace}am');

		expect(onChange).toBeCalled();
	});

	it('calls onChange when cents modified', () => {
		const onChange = vi.fn();

		const { centsInput } = renderComponent({ onChange });

		userEvent.type(centsInput, '1');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				cents: 5100,
			})
		);
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
				task: '',
				due: '1/1/2022, 11:59 PM',
				cents: 500,
			})
		);
	});

	it('preserves date when editing time', () => {
		const onChange = vi.fn();

		const { dueTimeInput } = renderComponent({
			task: 'the_task',
			due: new Date('1/1/2020 11:59 PM'),
			cents: 500,
			onChange,
		});

		userEvent.type(dueTimeInput, '{backspace}M{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				task: 'the_task',
				due: new Date('1/1/2020 11:59 PM'),
				cents: 500,
			})
		);
	});
});
