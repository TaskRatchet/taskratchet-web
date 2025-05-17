import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { getMe, logout } from '@taskratchet/sdk';
import { user } from '$lib/authStore';
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
		window.location = { ...oldLocation } as any;
		Object.defineProperty(window.location, 'href', {
			configurable: true,
			value: oldLocation.href,
			writable: true
		});
	});

	test('shows login link when not logged in', async () => {
		const mockGetMe = vi.mocked(getMe);
		mockGetMe.mockRejectedValueOnce(new Error('Not logged in'));

		render(Nav);

		expect(screen.getByText('Login')).toBeInTheDocument();
		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	test('shows email and logout button when logged in', async () => {
		const mockGetMe = vi.mocked(getMe);
		mockGetMe.mockResolvedValueOnce({ email: 'test@example.com' } as any);

		render(Nav);

		expect(await screen.findByText('test@example.com')).toBeInTheDocument();
		expect(screen.getByText('Logout')).toBeInTheDocument();
		expect(screen.queryByText('Login')).not.toBeInTheDocument();
	});

	test('handles logout', async () => {
		const mockGetMe = vi.mocked(getMe);
		mockGetMe
			.mockResolvedValueOnce({ email: 'test@example.com' } as any) // Initial mount
			.mockResolvedValueOnce(null as any); // After logout

		const mockLogout = vi.mocked(logout);
		mockLogout.mockResolvedValueOnce(undefined);

		render(Nav);

		const logoutButton = await screen.findByText('Logout');
		await fireEvent.click(logoutButton);

		expect(mockLogout).toHaveBeenCalled();
		expect(window.location.href).toBe('/login');
	});

	test('handles logout error', async () => {
		const mockGetMe = vi.mocked(getMe);
		mockGetMe.mockResolvedValueOnce({ email: 'test@example.com' } as any);

		const mockLogout = vi.mocked(logout);
		const error = new Error('Logout failed');
		mockLogout.mockImplementation(() => {
			throw error;
		});

		const consoleSpy = vi.spyOn(console, 'error');

		render(Nav);

		const logoutButton = await screen.findByText('Logout');
		await fireEvent.click(logoutButton);

		expect(mockLogout).toHaveBeenCalled();
		expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', error);
	});
});
