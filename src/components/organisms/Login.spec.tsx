import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import Login from './Login';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import loadControlledPromise from '../../lib/test/loadControlledPromise';
import { withMutedReactQueryLogger } from '../../lib/test/withMutedReactQueryLogger';
import { login, requestResetEmail } from '@taskratchet/sdk';

const api = {
	login,
	requestResetEmail,
};

describe('login form', () => {
	it('sends login request', async () => {
		renderWithQueryProvider(<Login />);

		await userEvent.type(screen.getByLabelText('Password'), 'the_password');
		await userEvent.type(screen.getByLabelText('Email'), 'the_email');
		await userEvent.click(screen.getByText('Submit'));

		await waitFor(() => {
			expect(api.login).toBeCalled();
		});
	});

	it('sends reset request', async () => {
		renderWithQueryProvider(<Login />);

		await userEvent.type(screen.getByLabelText('Email'), 'the_email');
		await userEvent.click(screen.getByText('Reset Password'));

		await waitFor(() => {
			expect(api.requestResetEmail).toBeCalled();
		});
	});

	it('requires email to login', async () => {
		renderWithQueryProvider(<Login />);

		await userEvent.type(screen.getByLabelText('Password'), 'the_password');
		await userEvent.click(screen.getByText('Submit'));

		await screen.findByText('Email is required');
	});

	it('requires password to login', async () => {
		renderWithQueryProvider(<Login />);

		await userEvent.type(screen.getByLabelText('Email'), 'the_email');
		await userEvent.click(screen.getByText('Submit'));

		await screen.findByText('Password is required');
	});

	it('requires email to reset password', async () => {
		renderWithQueryProvider(<Login />);

		await userEvent.click(screen.getByText('Reset Password'));

		await screen.findByText('Email is required');
	});

	it('displays error message if login fails', async () => {
		await withMutedReactQueryLogger(async () => {
			vi.mocked(api.login).mockRejectedValue('the_error');

			renderWithQueryProvider(<Login />);

			await userEvent.type(screen.getByLabelText('Email'), 'the_email');
			await userEvent.type(screen.getByLabelText('Password'), 'the_password');
			await userEvent.click(screen.getByText('Submit'));

			expect(await screen.findByText('Login failed')).toBeInTheDocument();
		});
	});

	it('displays error message if reset fails', async () => {
		await withMutedReactQueryLogger(async () => {
			vi.mocked(api.requestResetEmail).mockRejectedValue('the_error');

			renderWithQueryProvider(<Login />);

			await userEvent.type(screen.getByLabelText('Email'), 'the_email');
			await userEvent.click(screen.getByText('Reset Password'));

			expect(await screen.findByText('Reset failed')).toBeInTheDocument();
		});
	});

	it('clears reset error on new attempt', async () => {
		await withMutedReactQueryLogger(async () => {
			vi.mocked(api.requestResetEmail).mockRejectedValue('the_error');

			renderWithQueryProvider(<Login />);

			await userEvent.type(screen.getByLabelText('Email'), 'the_email');
			await userEvent.click(screen.getByText('Reset Password'));

			expect(await screen.findByText('Reset failed')).toBeInTheDocument();

			const { resolve } = loadControlledPromise(api.requestResetEmail);

			await userEvent.click(screen.getByText('Reset Password'));

			await waitFor(() => {
				expect(screen.queryByText('Reset failed')).not.toBeInTheDocument();
			});

			resolve();
		});
	});

	it('alerts reset success', async () => {
		renderWithQueryProvider(<Login />);

		await userEvent.type(screen.getByLabelText('Email'), 'the_email');
		await userEvent.click(screen.getByText('Reset Password'));

		expect(
			await screen.findByText('Instructions sent to the_email'),
		).toBeInTheDocument();
	});
});
