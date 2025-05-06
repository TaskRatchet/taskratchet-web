import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
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

	test('shows empty state', async () => {
		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce([]);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		expect(screen.getByText('No tasks yet. Create one to get started!')).toBeInTheDocument();
	});

	test('shows tasks', async () => {
		const mockTasks = [
			{
				id: '1',
				what: 'Test task 1',
				due: '2025-01-01T12:00:00Z',
				pnd: '5.00'
			},
			{
				id: '2',
				what: 'Test task 2',
				due: null,
				pnd: null
			}
		];

		const mockGetTasks = getTasks as ReturnType<typeof vi.fn>;
		mockGetTasks.mockResolvedValueOnce(mockTasks);

		user.set({ email: 'test@example.com' });
		render(Page);
		await tick();

		expect(screen.getByText('Test task 1')).toBeInTheDocument();
		expect(screen.getByText('Test task 2')).toBeInTheDocument();
		expect(screen.getByText('Penalty: $5.00')).toBeInTheDocument();
	});
});
