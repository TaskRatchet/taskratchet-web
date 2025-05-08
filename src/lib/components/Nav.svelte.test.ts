import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { getMe, logout } from '@taskratchet/sdk';
import { user } from '$lib/authStore';
import { tick } from 'svelte';
import Nav from './Nav.svelte';

// Mock SDK before importing Nav which imports authStore
vi.mock('@taskratchet/sdk', () => ({
	getMe: vi.fn(),
	logout: vi.fn()
}));

describe('Nav component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		user.set(null);

		// Mock window.location.href
		const oldLocation = window.location;
		delete (window as any).location;
		window.location = { ...oldLocation };
		Object.defineProperty(window.location, 'href', {
			configurable: true,
			value: oldLocation.href,
			writable: true
		});
	});

	test('shows login link when not logged in', async () => {
		const mockGetMe = getMe as ReturnType<typeof vi.fn>;
		mockGetMe.mockRejectedValueOnce(new Error('Not logged in'));

		render(Nav);
		await tick();

		expect(screen.getByText('Login')).toBeInTheDocument();
		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	test('shows email and logout button when logged in', async () => {
		const mockGetMe = getMe as ReturnType<typeof vi.fn>;
		mockGetMe.mockResolvedValueOnce({ email: 'test@example.com' });

		render(Nav);
		await tick();

		expect(screen.getByText('test@example.com')).toBeInTheDocument();
		expect(screen.getByText('Logout')).toBeInTheDocument();
		expect(screen.queryByText('Login')).not.toBeInTheDocument();
	});

	test('handles logout', async () => {
		const mockGetMe = getMe as ReturnType<typeof vi.fn>;
		mockGetMe
			.mockResolvedValueOnce({ email: 'test@example.com' }) // Initial mount
			.mockResolvedValueOnce(null); // After logout

		const mockLogout = logout as ReturnType<typeof vi.fn>;
		mockLogout.mockResolvedValueOnce(undefined);

		render(Nav);
		await tick();

		const logoutButton = screen.getByText('Logout');
		await fireEvent.click(logoutButton);

		expect(mockLogout).toHaveBeenCalled();
		expect(window.location.href).toBe('/login');
	});

	test('handles logout error', async () => {
		const mockGetMe = getMe as ReturnType<typeof vi.fn>;
		mockGetMe.mockResolvedValueOnce({ email: 'test@example.com' });

		const mockLogout = logout as ReturnType<typeof vi.fn>;
		const error = new Error('Logout failed');
		mockLogout.mockImplementation(() => {
			throw error;
		});

		const consoleSpy = vi.spyOn(console, 'error');

		render(Nav);
		await tick();

		const logoutButton = screen.getByText('Logout');
		await fireEvent.click(logoutButton);

		expect(mockLogout).toHaveBeenCalled();
		expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', error);
	});
});
