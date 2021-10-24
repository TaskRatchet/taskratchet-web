import TaskForm from './TaskForm';
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

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
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<TaskForm
				{...{ task, due, cents, timezone, error, onChange, onSubmit }}
			/>
		</MuiPickersUtilsProvider>
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
	it('renders', async () => {
		await renderComponent();
	});

	it('has task input', async () => {
		const { getByLabelText } = await renderComponent();

		expect(getByLabelText('Task *')).toBeInTheDocument();
	});

	it('calls onChange when task modified', async () => {
		const onChange = jest.fn();

		const { taskInput } = await renderComponent({ onChange });

		await userEvent.type(taskInput, 'a');

		expect(onChange).toBeCalledWith('a', null, null);
	});

	it('calls onChange when due modified', async () => {
		const onChange = jest.fn();

		const { dueTimeInput } = await renderComponent({ onChange });

		await userEvent.type(dueTimeInput, '{backspace}{backspace}AM');

		expect(onChange).toBeCalled();
	});

	it('calls onChange when cents modified', async () => {
		const onChange = jest.fn();

		const { centsInput } = await renderComponent({ onChange });

		await userEvent.type(centsInput, '1');

		expect(onChange).toBeCalledWith('', null, 100);
	});

	it('allows deleting all stakes digits', async () => {
		const { centsInput } = await renderComponent();

		await userEvent.type(centsInput, '{backspace}');

		expect(centsInput).toHaveValue(null);
	});

	it('preserves time when editing date', async () => {
		const onChange = jest.fn();

		const { dueDateInput } = await renderComponent({
			due: new Date('1/1/2021 11:59 PM'),
			cents: 500,
			onChange,
		});

		await userEvent.type(dueDateInput, '{backspace}2{enter}');

		expect(onChange).toBeCalledWith('', new Date('1/1/2022 11:59 PM'), 500);
	});

	it('preserves date when editing time', async () => {
		const onChange = jest.fn();

		const { dueTimeInput } = await renderComponent({
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
