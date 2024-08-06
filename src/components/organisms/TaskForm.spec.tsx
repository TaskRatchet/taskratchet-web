import TaskForm from './TaskForm';
import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';

vi.mock('../../lib/Browser');
vi.mock('@mui/x-date-pickers');

interface RenderComponentProps {
	task?: string;
	due?: string;
	cents?: number;
	timezone?: string;
	error?: string;
	onChange?: (updates: Partial<TaskInput>) => void;
	onCancel?: () => void;
	onSubmit?: () => void;
	isLoading?: boolean;
}

const renderComponent = (props: RenderComponentProps = {}) => {
	const {
		task = '',
		due = '1/1/2022, 11:59 PM',
		cents = 500,
		timezone = '',
		error = '',
		onChange = () => undefined,
		onCancel = () => undefined,
		onSubmit = () => undefined,
		isLoading = false,
	} = props;

	const view: RenderResult = render(
		<TaskForm
			{...{
				task,
				due,
				cents,
				timezone,
				error,
				onChange,
				onCancel,
				onSubmit,
				isLoading,
			}}
		/>,
	);

	return {
		...view,
		centsInput: screen.getByLabelText('Stakes *'),
	};
};

describe('TaskForm', () => {
	it('has task input', () => {
		renderComponent();

		expect(screen.getByLabelText('Task *')).toBeInTheDocument();
	});

	it('calls onChange when task modified', async () => {
		const onChange = vi.fn();
		const due = 'the_due';

		renderComponent({ onChange, due });

		await userEvent.type(screen.getByLabelText('Task *'), 'a');

		expect(onChange).toBeCalledWith({
			task: 'a',
		});
	});

	it('calls onChange when due modified', async () => {
		const onChange = vi.fn();

		renderComponent({ onChange });

		await userEvent.type(
			await screen.findByLabelText('Due Time *'),
			'{backspace}{backspace}am',
		);

		expect(onChange).toBeCalled();
	});

	it('calls onChange when cents modified', async () => {
		const onChange = vi.fn();

		const { centsInput } = renderComponent({ onChange });

		await userEvent.type(centsInput, '1');

		expect(onChange).toBeCalledWith({
			cents: 5100,
		});
	});

	it('preserves time when editing date', async () => {
		const onChange = vi.fn();

		renderComponent({
			due: '1/1/2021, 11:59 PM',
			cents: 500,
			onChange,
		});

		await userEvent.type(
			await screen.findByLabelText('Due Date *'),
			'{backspace}2{enter}',
		);

		expect(onChange).toBeCalledWith({
			due: '1/1/2022, 11:59 PM',
		});
	});

	it('preserves date when editing time', async () => {
		const onChange = vi.fn();

		renderComponent({
			task: 'the_task',
			due: '1/1/2020, 11:59 PM',
			cents: 500,
			onChange,
		});

		await userEvent.type(
			await screen.findByLabelText('Due Time *'),
			'{backspace}M{enter}',
		);

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				due: '1/1/2020, 11:59 PM',
			}),
		);
	});
});
