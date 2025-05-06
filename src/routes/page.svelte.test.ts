import { describe, test, expect, vi, beforeEach, afterAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { getTasks } from '@taskratchet/sdk';
import { user } from '$lib/authStore';
import { tick } from 'svelte';
import Page from './+page.svelte';

vi.mock('@taskratchet/sdk', () => ({
	getTasks: vi.fn()
}));

describe('Home page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		user.set(null);
		
		// Reset Date to a fixed point for consistent testing
		const mockDate = new Date('2025-01-01T12:00:00Z');
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
				due: '2025-02-01T12:00:00Z',
				due_timestamp: 1738425600, // 2025-02-01 in seconds
				cents: 500,
				complete: true, // This task is complete
				status: 'pending',
				timezone: 'UTC'
			},
			{
				id: '2',
				task: 'Past task',
				due: '2024-12-01T12:00:00Z',
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
		expect(futureTaskCheckbox).toBeDisabled();
		expect(screen.queryByText('Past task')).not.toBeInTheDocument();

		// Switch to Archive view - check Past task and its checkbox
		await fireEvent.click(screen.getByText('Archive'));
		expect(screen.queryByText('Future task')).not.toBeInTheDocument();
		expect(screen.getByText('Past task')).toBeInTheDocument();
		const pastTaskCheckbox = screen.getByRole('checkbox', { name: '' });
		expect(pastTaskCheckbox).not.toBeChecked();
		expect(pastTaskCheckbox).toBeDisabled();

		// Switch back to Next view
		await fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Future task')).toBeInTheDocument();
		expect(screen.queryByText('Past task')).not.toBeInTheDocument();
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
		expect(checkbox).toBeDisabled();
	});
});
