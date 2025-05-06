import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { login } from '@taskratchet/sdk';
import Page from './+page.svelte';

vi.mock('@taskratchet/sdk', () => ({
	login: vi.fn()
}));

describe('Login page', () => {
	beforeEach(() => {
		// Reset mocks
		vi.clearAllMocks();
		
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

	test('renders login form', () => {
		render(Page);
		expect(screen.getByRole('heading')).toHaveTextContent('Login to TaskRatchet');
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
		expect(screen.getByLabelText('Password')).toBeInTheDocument();
		expect(screen.getByRole('button')).toHaveTextContent('Login');
	});

	test('handles successful login', async () => {
		const mockLogin = login as unknown as ReturnType<typeof vi.fn>;
		mockLogin.mockResolvedValueOnce(undefined);
		
		const { container } = render(Page);
		
		await fireEvent.input(screen.getByLabelText('Email'), {
			target: { value: 'test@example.com' }
		});
		await fireEvent.input(screen.getByLabelText('Password'), {
			target: { value: 'password123' }
		});
		
		const form = container.querySelector('form');
		expect(form).toBeInTheDocument();
		await fireEvent.submit(form!);
		
		expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
		expect(window.location.href).toBe('/');
	});

	test('handles login error', async () => {
		const mockLogin = login as unknown as ReturnType<typeof vi.fn>;
		mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
		
		const { container } = render(Page);
		
		await fireEvent.input(screen.getByLabelText('Email'), {
			target: { value: 'test@example.com' }
		});
		await fireEvent.input(screen.getByLabelText('Password'), {
			target: { value: 'wrong-password' }
		});
		
		const form = container.querySelector('form');
		expect(form).toBeInTheDocument();
		await fireEvent.submit(form!);
		
		expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
	});
});