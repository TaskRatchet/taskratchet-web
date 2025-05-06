import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { addTask } from '@taskratchet/sdk';
import TaskModal from './TaskModal.svelte';

vi.mock('@taskratchet/sdk', () => ({
	addTask: vi.fn()
}));

describe('TaskModal component', () => {
	const mockOnClose = vi.fn();
	const mockOnTaskAdded = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders nothing when closed', () => {
		render(TaskModal, {
			props: {
				isOpen: false,
				onClose: mockOnClose,
				onTaskAdded: mockOnTaskAdded
			}
		});

		expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
	});

	test('renders form when open', () => {
		render(TaskModal, {
			props: {
				isOpen: true,
				onClose: mockOnClose,
				onTaskAdded: mockOnTaskAdded
			}
		});

		expect(screen.getByText('Create New Task')).toBeInTheDocument();
		expect(screen.getByLabelText('Task')).toBeInTheDocument();
		expect(screen.getByLabelText('Penalty Amount ($)')).toBeInTheDocument();
		expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
		expect(screen.getByText('Create Task')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	test('handles successful task creation', async () => {
		const mockAddTask = addTask as ReturnType<typeof vi.fn>;
		mockAddTask.mockResolvedValueOnce(undefined);

		render(TaskModal, {
			props: {
				isOpen: true,
				onClose: mockOnClose,
				onTaskAdded: mockOnTaskAdded
			}
		});

		await fireEvent.input(screen.getByLabelText('Task'), {
			target: { value: 'Test task' }
		});
		await fireEvent.input(screen.getByLabelText('Penalty Amount ($)'), {
			target: { value: '5' }
		});
		await fireEvent.input(screen.getByLabelText('Due Date'), {
			target: { value: '2025-01-01T12:00' }
		});

		await fireEvent.click(screen.getByText('Create Task'));

		// The test environment is in UTC-5, so when we input 12:00 local time,
		// it becomes 17:00 UTC. Let's adjust our expectation accordingly.
		expect(mockAddTask).toHaveBeenCalledWith({
			task: 'Test task',
			cents: 5,
			due: '2025-01-01T17:00:00.000Z'
		});
		expect(mockOnClose).toHaveBeenCalled();
		expect(mockOnTaskAdded).toHaveBeenCalled();
	});

	test('handles task creation error', async () => {
		const mockAddTask = addTask as ReturnType<typeof vi.fn>;
		mockAddTask.mockRejectedValueOnce(new Error('Failed to create task'));

		render(TaskModal, {
			props: {
				isOpen: true,
				onClose: mockOnClose,
				onTaskAdded: mockOnTaskAdded
			}
		});

		await fireEvent.input(screen.getByLabelText('Task'), {
			target: { value: 'Test task' }
		});
		await fireEvent.input(screen.getByLabelText('Penalty Amount ($)'), {
			target: { value: '5' }
		});
		await fireEvent.input(screen.getByLabelText('Due Date'), {
			target: { value: '2025-01-01T12:00' }
		});

		await fireEvent.click(screen.getByText('Create Task'));

		expect(screen.getByText('Failed to create task')).toBeInTheDocument();
		expect(mockOnClose).not.toHaveBeenCalled();
		expect(mockOnTaskAdded).not.toHaveBeenCalled();
	});

	test('handles cancel button click', async () => {
		render(TaskModal, {
			props: {
				isOpen: true,
				onClose: mockOnClose,
				onTaskAdded: mockOnTaskAdded
			}
		});

		await fireEvent.click(screen.getByText('Cancel'));

		expect(mockOnClose).toHaveBeenCalled();
	});
});