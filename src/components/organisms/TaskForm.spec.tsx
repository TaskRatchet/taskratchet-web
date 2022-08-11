import TaskForm from './TaskForm';
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TaskFormProps } from './TaskForm';

jest.mock('../../lib/Browser');

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

	const result: RenderResult = render(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<TaskForm {...p} />
		</LocalizationProvider>
	);

	return {
		...result,
		taskInput: result.getByLabelText('Task *') as HTMLInputElement,
		dueDateInput: result.getByLabelText('Due Date *') as HTMLInputElement,
		dueTimeInput: result.getByLabelText('Due Time *') as HTMLInputElement,
		centsInput: result.getByLabelText('Stakes *') as HTMLInputElement,
	};
};

describe('TaskForm', () => {
	it('has task input', async () => {
		const { getByLabelText } = renderComponent();

		expect(getByLabelText('Task *')).toBeInTheDocument();
	});

	it('calls onChange when task modified', async () => {
		const onChange = jest.fn();
		const due = '1/1/2022, 11:59 PM';

		const { taskInput } = renderComponent({ onChange, due });

		await userEvent.type(taskInput, 'a');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				task: 'a',
				due,
				cents: 500,
			})
		);
	});

	it('calls onChange when due modified', async () => {
		const onChange = jest.fn();

		const { dueTimeInput } = renderComponent({ onChange });

		await userEvent.type(dueTimeInput, '{backspace}{backspace}am');

		expect(onChange).toBeCalled();
	});

	it('calls onChange when cents modified', async () => {
		const onChange = jest.fn();

		const { centsInput } = renderComponent({ onChange });

		await userEvent.type(centsInput, '1');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				cents: 5100,
			})
		);
	});

	it('preserves time when editing date', async () => {
		const onChange = jest.fn();

		const { dueDateInput } = renderComponent({
			due: '1/1/2021, 11:59 PM',
			cents: 500,
			onChange,
		});

		await userEvent.type(dueDateInput, '{backspace}2{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				task: '',
				due: '1/1/2022, 11:59 PM',
				cents: 500,
			})
		);
	});

	it('preserves date when editing time', async () => {
		const onChange = jest.fn();

		const { dueTimeInput } = renderComponent({
			due: '1/1/2020, 11:59 PM',
			cents: 500,
			onChange,
		});

		await userEvent.type(dueTimeInput, '{backspace}M{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				task: '',
				due: '1/1/2020, 11:59 PM',
				cents: 500,
			})
		);
	});
});

// TODO:
// prevent adding task where date and time is in the past
