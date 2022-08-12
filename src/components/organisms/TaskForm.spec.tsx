import TaskForm from './TaskForm';
import React from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

interface RenderComponentProps {
	task?: string;
	due?: Date;
	cents?: number;
	timezone?: string;
	error?: string;
	onChange?: (task: string, due: Date, cents: number) => void;
	onSubmit?: () => void;
	isLoading?: boolean;
}

const renderComponent = (props: RenderComponentProps = {}) => {
	const {
		task = '',
		due = new Date(),
		cents = 500,
		timezone = '',
		error = '',
		onChange = () => undefined,
		onSubmit = () => undefined,
		isLoading = false,
	} = props;

	const result: RenderResult = render(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<TaskForm
				{...{
					task,
					due,
					cents,
					timezone,
					error,
					onChange,
					onSubmit,
					isLoading,
				}}
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
		const onChange = vi.fn();
		const due = new Date();

		const { taskInput } = renderComponent({ onChange, due });

		await userEvent.type(taskInput, 'a');

		expect(onChange).toBeCalledWith('a', due, 500);
	});

	it('calls onChange when due modified', async () => {
		const onChange = vi.fn();

		const { dueTimeInput } = renderComponent({ onChange });

		await userEvent.type(dueTimeInput, '{backspace}{backspace}am');

		expect(onChange).toBeCalled();
	});

	it('calls onChange when cents modified', async () => {
		const onChange = vi.fn();

		const { centsInput } = renderComponent({ onChange });

		await userEvent.type(centsInput, '1');

		expect(onChange).toBeCalledWith(expect.anything(), expect.anything(), 5100);
	});

	it('preserves time when editing date', async () => {
		const onChange = vi.fn();

		const { dueDateInput } = renderComponent({
			due: new Date('1/1/2021 11:59 PM'),
			cents: 500,
			onChange,
		});

		await userEvent.type(dueDateInput, '{backspace}2{enter}');

		expect(onChange).toBeCalledWith('', new Date('1/1/2022 11:59 PM'), 500);
	});

	it('preserves date when editing time', async () => {
		const onChange = vi.fn();

		const { dueTimeInput } = renderComponent({
			task: 'the_task',
			due: new Date('1/1/2020 11:59 PM'),
			cents: 500,
			onChange,
		});

		userEvent.type(dueTimeInput, '{backspace}M{enter}');

		expect(onChange).toBeCalledWith(
			'the_task',
			new Date('1/1/2020 11:59 PM'),
			500
		);
	});
});
