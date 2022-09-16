import { renderWithQueryProvider } from '../../lib/test/helpers';
import Login from './Login';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { login } from '../../lib/api/login';
import { requestResetEmail } from '../../lib/api/requestResetEmail';

const api = {
	login,
	requestResetEmail,
};

vi.mock('../../lib/LegacyApi');

describe('login form', () => {
	it('sends login request', async () => {
		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.type(screen.getByLabelText('Password'), 'the_password');
		userEvent.click(screen.getByText('Submit'));

		await waitFor(() => {
			expect(api.login).toBeCalled();
		});
	});

	it('sends reset request', async () => {
		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.click(screen.getByText('Reset Password'));

		await waitFor(() => {
			expect(api.requestResetEmail).toBeCalled();
		});
	});

	it('requires email to login', async () => {
		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Password'), 'the_password');
		userEvent.click(screen.getByText('Submit'));

		await screen.findByText('Email is required');
	});

	it('requires password to login', async () => {
		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.click(screen.getByText('Submit'));

		await screen.findByText('Password is required');
	});

	it('requires email to reset password', async () => {
		renderWithQueryProvider(<Login />);

		userEvent.click(screen.getByText('Reset Password'));

		await screen.findByText('Email is required');
	});

	it('displays error message if login fails', async () => {
		vi.mocked(api.login).mockRejectedValue('the_error');

		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.type(screen.getByLabelText('Password'), 'the_password');
		userEvent.click(screen.getByText('Submit'));

		expect(await screen.findByText('Login failed')).toBeInTheDocument();
	});

	it('displays error message if reset fails', async () => {
		vi.mocked(api.requestResetEmail).mockRejectedValue('the_error');

		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.click(screen.getByText('Reset Password'));

		expect(await screen.findByText('Reset failed')).toBeInTheDocument();
	});

	it('clears reset error on new attempt', async () => {
		vi.mocked(api.requestResetEmail).mockRejectedValue('the_error');

		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.click(screen.getByText('Reset Password'));

		expect(await screen.findByText('Reset failed')).toBeInTheDocument();

		userEvent.click(screen.getByText('Reset Password'));

		await waitFor(() => {
			expect(screen.queryByText('Reset failed')).not.toBeInTheDocument();
		});
	});

	it('alerts reset success', async () => {
		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.click(screen.getByText('Reset Password'));

		expect(
			await screen.findByText('Instructions sent to the_email')
		).toBeInTheDocument();
	});
});
