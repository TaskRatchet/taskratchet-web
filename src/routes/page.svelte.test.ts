import { describe, test, expect, vi, beforeEach, afterAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { getTasks, updateTask, addTask } from '@taskratchet/sdk';
import { user } from '$lib/authStore';
import { tick } from 'svelte';
import Page from './+page.svelte';

vi.mock('@taskratchet/sdk', () => ({
	getTasks: vi.fn(),
	updateTask: vi.fn(),
	addTask: vi.fn()
}));

describe('Home page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		user.set(null);

		// Reset Date to a fixed point for consistent testing
		const mockDate = new Date('2025-01-01T12:00:00.000Z');
		vi.setSystemTime(mockDate);
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	test('shows welcome message when not logged in', () => {
		render(Page);
		expect(screen.getByText('Welcome to TaskRatchet')).toBeInTheDocument();
		expect(screen.getByText('log in')).toHaveAttribute('href', '/login');
	});

	test('shows loading state', async () => {
		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockImplementation(() => new Promise(() => {})); // Never resolves

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
	});

	test('shows error state', async () => {
		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockRejectedValueOnce(new Error('Failed to fetch tasks'));

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
	});

	test('shows empty state for Next tasks', async () => {
		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce([]);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		expect(screen.getByText('No upcoming tasks. Create one to get started!')).toBeInTheDocument();
	});

	test('shows empty state for Archive tasks', async () => {
		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce([]);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		// Click Archive tab
		await fireEvent.click(screen.getByText('Archive'));

		expect(screen.getByText('No archived tasks.')).toBeInTheDocument();
	});

	test('filters tasks into Next and Archive views', async () => {
		const mockTasks = [
			{
				id: '1',
				task: 'Future task',
				due: '2025-02-01T12:00:00.000Z',
				due_timestamp: 1738425600, // 2025-02-01 in seconds
				cents: 500,
				complete: true, // This task is complete
				status: 'pending',
				timezone: 'UTC'
			},
			{
				id: '2',
				task: 'Past task',
				due: '2024-12-01T12:00:00.000Z',
				due_timestamp: 1733059200, // 2024-12-01 in seconds
				cents: 300,
				complete: false, // This task is incomplete
				status: 'pending',
				timezone: 'UTC'
			}
		];

		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce(mockTasks);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		// Initially in Next view - check Future task and its checkbox
		expect(screen.getByText('Future task')).toBeInTheDocument();
		const futureTaskCheckbox = screen.getByRole('checkbox', { name: '' });
		expect(futureTaskCheckbox).toBeChecked();
		expect(futureTaskCheckbox).not.toBeDisabled(); // Next view checkboxes are enabled
		expect(screen.queryByText('Past task')).not.toBeInTheDocument();

		// Switch to Archive view - check Past task and its checkbox
		await fireEvent.click(screen.getByText('Archive'));
		expect(screen.queryByText('Future task')).not.toBeInTheDocument();
		expect(screen.getByText('Past task')).toBeInTheDocument();
		const pastTaskCheckbox = screen.getByRole('checkbox', { name: '' });
		expect(pastTaskCheckbox).not.toBeChecked();
		expect(pastTaskCheckbox).toBeDisabled(); // Archive view checkboxes are disabled

		// Switch back to Next view
		await fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Future task')).toBeInTheDocument();
		expect(screen.queryByText('Past task')).not.toBeInTheDocument();
		const nextViewCheckbox = screen.getByRole('checkbox', { name: '' });
		expect(nextViewCheckbox).not.toBeDisabled(); // Next view checkboxes are enabled
	});

	test('handles tasks without due dates', async () => {
		const mockTasks = [
			{
				id: '1',
				task: 'Task without due date',
				due: null,
				due_timestamp: 0,
				cents: 500,
				complete: true, // This task is complete
				status: 'pending',
				timezone: 'UTC'
			}
		];

		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce(mockTasks);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		// Task without due date should be in Archive (due_timestamp of 0 is in the past)
		expect(screen.queryByText('Task without due date')).not.toBeInTheDocument();

		await fireEvent.click(screen.getByText('Archive'));
		expect(screen.getByText('Task without due date')).toBeInTheDocument();
		const checkbox = screen.getByRole('checkbox', { name: '' });
		expect(checkbox).toBeChecked();
		expect(checkbox).toBeDisabled(); // Archive view checkboxes are disabled
	});

	test('handles task completion toggle', async () => {
		const mockTasks = [
			{
				id: '1',
				task: 'Test task',
				due: '2025-02-01T12:00:00.000Z',
				due_timestamp: 1738425600,
				cents: 500,
				complete: false,
				status: 'pending',
				timezone: 'UTC'
			}
		];

		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce(mockTasks);

		const mockUpdateTask = updateTask as ReturnType<typeof vi.fn>;
		mockUpdateTask.mockResolvedValueOnce(undefined);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		// Initially unchecked
		const checkbox = screen.getByRole('checkbox', { name: '' });
		expect(checkbox).not.toBeChecked();

		// Click checkbox
		await fireEvent.click(checkbox);

		// Should be checked (optimistic update)
		expect(checkbox).toBeChecked();

		// Should have called updateTask
		expect(mockUpdateTask).toHaveBeenCalledWith('1', { complete: true });
	});

	test('handles task completion toggle error', async () => {
		const mockTasks = [
			{
				id: '1',
				task: 'Test task',
				due: '2025-02-01T12:00:00.000Z',
				due_timestamp: 1738425600,
				cents: 500,
				complete: false,
				status: 'pending',
				timezone: 'UTC'
			}
		];

		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce(JSON.parse(JSON.stringify(mockTasks)));

		const mockUpdateTask = updateTask as ReturnType<typeof vi.fn>;
		let rejectUpdateTaskPromise: (reason?: any) => void;
		const updateTaskPromise = new Promise((_, reject) => {
			rejectUpdateTaskPromise = reject;
		});
		mockUpdateTask.mockReturnValueOnce(updateTaskPromise);

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		// Initially unchecked
		const checkbox = screen.getByRole('checkbox', { name: '' });
		expect(checkbox).not.toBeChecked();

		// Click checkbox and let optimistic update render
		await fireEvent.click(checkbox);
		await tick();

		// Should be checked (optimistic update)
		expect(checkbox).toBeChecked();

		// Make updateTask fail and let reversion render
		rejectUpdateTaskPromise!(new Error('Update failed'));
		await tick();

		// Should revert to unchecked
		expect(checkbox).not.toBeChecked();

		// Should have logged error and called updateTask
		expect(mockUpdateTask).toHaveBeenCalledWith('1', { complete: true });
		expect(consoleSpy).toHaveBeenCalledWith('Failed to update task:', expect.any(Error));

		consoleSpy.mockRestore();
	});

	test('sorts tasks by due date descending', async () => {
		const mockTasks = [
			{
				id: '1',
				task: 'Oldest task',
				due: '2024-12-01T12:00:00.000Z',
				due_timestamp: 1733059200, // 2024-12-01
				cents: 500,
				complete: false,
				status: 'pending',
				timezone: 'UTC'
			},
			{
				id: '2',
				task: 'Latest task',
				due: '2025-02-01T12:00:00.000Z',
				due_timestamp: 1738425600, // 2025-02-01
				cents: 300,
				complete: false,
				status: 'pending',
				timezone: 'UTC'
			},
			{
				id: '3',
				task: 'Middle task',
				due: '2025-01-01T12:00:00.000Z',
				due_timestamp: 1735833600, // 2025-01-01
				cents: 400,
				complete: false,
				status: 'pending',
				timezone: 'UTC'
			},
			{
				id: '4',
				task: 'No due date task',
				due: null,
				due_timestamp: 0,
				cents: 200,
				complete: false,
				status: 'pending',
				timezone: 'UTC'
			}
		];

		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		// Deliberately provide tasks in unsorted order
		mockGetTasks.mockResolvedValueOnce(mockTasks);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		// In Next view, should show tasks due today or later, sorted latest first
		const nextTaskElements = screen.getAllByRole('listitem');
		expect(nextTaskElements).toHaveLength(2); // Latest and Middle tasks
		expect(nextTaskElements[0]).toHaveTextContent('Latest task');
		expect(nextTaskElements[1]).toHaveTextContent('Middle task');
		// Next view checkboxes should be enabled
		const nextCheckboxes = screen.getAllByRole('checkbox', { name: '' });
		nextCheckboxes.forEach((checkbox) => {
			expect(checkbox).not.toBeDisabled();
		});

		// Switch to Archive view
		await fireEvent.click(screen.getByText('Archive'));

		// In Archive view, should show tasks due before today, sorted latest first
		const archiveTaskElements = screen.getAllByRole('listitem');
		expect(archiveTaskElements).toHaveLength(2); // Oldest and No due date tasks
		expect(archiveTaskElements[0]).toHaveTextContent('Oldest task');
		expect(archiveTaskElements[1]).toHaveTextContent('No due date task');
		// Archive view checkboxes should be disabled
		const archiveCheckboxes = screen.getAllByRole('checkbox', { name: '' });
		archiveCheckboxes.forEach((checkbox) => {
			expect(checkbox).toBeDisabled();
		});
	});

	test('shows new task button when logged in', async () => {
		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce([]);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		expect(screen.getByText('New Task')).toBeInTheDocument();
	});

	test('opens task modal when new task button is clicked', async () => {
		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce([]);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		await fireEvent.click(screen.getByText('New Task'));
		expect(screen.getByText('Create New Task')).toBeInTheDocument();
	});

	test('refreshes tasks after new task is added', async () => {
		const mockAddTask = addTask as ReturnType<typeof vi.fn>;
		mockAddTask.mockResolvedValue(undefined); // Mock successful task addition

		const initialTasks = [
			{
				id: '1',
				task: 'Existing task',
				due: '2025-02-01T12:00:00.000Z',
				due_timestamp: 1738425600,
				cents: 500,
				complete: false,
				status: 'pending',
				timezone: 'UTC'
			}
		];
		const updatedTasks = [
			...initialTasks,
			{
				id: '2',
				task: 'New task',
				due: '2025-03-01T12:00:00.000Z',
				due_timestamp: 1740844800,
				cents: 300,
				complete: false,
				status: 'pending',
				timezone: 'UTC'
			}
		];

		// Create a promise that we can resolve when we want getTasks to return
		let resolveFirstGetTasks: (value: any) => void = () => {
			throw new Error('Unexpected call to getTasks');
		};
		const firstGetTasksPromise = new Promise((resolve) => {
			resolveFirstGetTasks = resolve;
		});

		let resolveSecondGetTasks: (value: any) => void = () => {
			throw new Error('Unexpected call to getTasks');
		};
		const secondGetTasksPromise = new Promise((resolve) => {
			resolveSecondGetTasks = resolve;
		});

		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks
			.mockReturnValueOnce(firstGetTasksPromise)
			.mockReturnValueOnce(secondGetTasksPromise)
			.mockResolvedValueOnce(updatedTasks);

		user.set({ email: 'test@example.com' });
		render(Page);

		// Resolve the first getTasks call with initialTasks
		resolveFirstGetTasks(initialTasks);
		await tick();

		// Initial render should show existing task
		expect(screen.getByText('Existing task')).toBeInTheDocument();
		expect(screen.queryByText('New task')).not.toBeInTheDocument();

		// Resolve the second getTasks call (from onMount) with initialTasks
		resolveSecondGetTasks(initialTasks);
		await tick();

		// Still should not show new task
		expect(screen.queryByText('New task')).not.toBeInTheDocument();

		// Open modal and create new task
		await fireEvent.click(screen.getByText('New Task'));
		await fireEvent.input(screen.getByLabelText('Task'), {
			target: { value: 'New task' }
		});
		await fireEvent.input(screen.getByLabelText('Penalty Amount (whole $)'), {
			target: { value: '3' }
		});
		await fireEvent.input(screen.getByLabelText('Due Date'), {
			target: { value: '2025-03-01T12:00' }
		});
		await fireEvent.click(screen.getByText('Create Task'));

		// Wait for all the async operations and re-renders
		await tick(); // For handleSubmit in modal to complete
		await tick(); // For Page's onTaskAdded handler
		await tick(); // For loadTasks and re-render

		// After task is added, both tasks should be visible
		expect(screen.getByText('Existing task')).toBeInTheDocument();
		expect(screen.getByText('New task')).toBeInTheDocument();
	});

	test('calls addTask with correct parameters when creating new task', async () => {
		const mockAddTask = addTask as ReturnType<typeof vi.fn>;
		mockAddTask.mockResolvedValue(undefined); // Mock successful task addition

		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValue([]); // Empty task list is fine for this test

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		// Open modal and create new task
		await fireEvent.click(screen.getByText('New Task'));
		await fireEvent.input(screen.getByLabelText('Task'), {
			target: { value: 'Test task description' }
		});
		await fireEvent.input(screen.getByLabelText('Penalty Amount (whole $)'), {
			target: { value: '5' }
		});
		await fireEvent.input(screen.getByLabelText('Due Date'), {
			target: { value: '2025-03-01T12:00' }
		});
		await fireEvent.click(screen.getByText('Create Task'));

		await tick(); // For handleSubmit in modal to complete

		// Verify addTask was called with correct parameters
		// The test environment is in UTC-5, so when we input 12:00 local time,
		// it becomes 17:00 UTC. Let's adjust our expectation accordingly.
		expect(mockAddTask).toHaveBeenCalledWith({
			task: 'Test task description',
			cents: 500, // $5.00 = 500 cents
			due: '2025-03-01T17:00:00.000Z'
		});
	});
});
