import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { login } from '@taskratchet/sdk';
import Page from './+page.svelte';
import { goto } from '$app/navigation';

vi.mock('@taskratchet/sdk');
vi.mock('$app/navigation');

describe('Login page', () => {
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
		expect(goto).toBeCalled();
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
