import TaskForm from './TaskForm';
import React from 'react';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

jest.mock('@mui/lab', () => {
	return {
		DatePicker: jest.requireActual('@mui/lab/DesktopDatePicker').default,
		TimePicker: jest.requireActual('@mui/lab/DesktopTimePicker').default,
	};
});

global.document.createRange = () =>
	({
		setStart: () => undefined,
		setEnd: () => undefined,
		commonAncestorContainer: {
			nodeName: 'BODY',
			ownerDocument: document,
		},
	} as unknown as Range);

interface RenderComponentProps {
	task?: string;
	due?: Date | null;
	cents?: number | null;
	timezone?: string;
	error?: string;
	onChange?: (task: string, due: Date | null, cents: number | null) => void;
	onSubmit?: () => void;
}

const renderComponent = (props: RenderComponentProps = {}) => {
	const {
		task = '',
		due = null,
		cents = null,
		timezone = '',
		error = '',
		onChange = () => undefined,
		onSubmit = () => undefined,
	} = props;

	const result: RenderResult = render(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<TaskForm
				{...{ task, due, cents, timezone, error, onChange, onSubmit }}
			/>
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

		const { taskInput } = renderComponent({ onChange });

		await userEvent.type(taskInput, 'a');

		expect(onChange).toBeCalledWith('a', null, null);
	});

	it('calls onChange when due modified', async () => {
		const onChange = jest.fn();

		const { dueTimeInput } = renderComponent({ onChange });

		fireEvent.change(dueTimeInput);

		expect(onChange).toBeCalled();
	});

	it('calls onChange when cents modified', async () => {
		const onChange = jest.fn();

		const { centsInput } = renderComponent({ onChange });

		await userEvent.type(centsInput, '1');

		expect(onChange).toBeCalledWith('', null, 100);
	});

	it('allows deleting all stakes digits', async () => {
		const { centsInput } = renderComponent();

		await userEvent.type(centsInput, '{backspace}');

		expect(centsInput).toHaveValue(null);
	});

	it('preserves time when editing date', async () => {
		const onChange = jest.fn();

		const { dueDateInput } = renderComponent({
			due: new Date('1/1/2021 11:59 PM'),
			cents: 500,
			onChange,
		});

		await userEvent.type(dueDateInput, '{backspace}2{enter}');

		expect(onChange).toBeCalledWith('', new Date('1/1/2022 11:59 PM'), 500);
	});

	it('preserves date when editing time', async () => {
		const onChange = jest.fn();

		const { dueTimeInput } = renderComponent({
			due: new Date('1/1/2020 11:59 PM'),
			cents: 500,
			onChange,
		});

		await userEvent.type(dueTimeInput, '{backspace}M{enter}');

		expect(onChange).toBeCalledWith('', new Date('1/1/2020 11:59 PM'), 500);
	});
});

// TODO:
// remembers last stakes
// remembers last due
// prevent adding task where date and time is in the past
