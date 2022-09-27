import createLoginMachine from './Login.machine';
import { interpret } from 'xstate';
import { renderWithQueryProvider } from '../../lib/test/helpers';
import Login from './Login';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { login } from '../../lib/api/login';
import { requestResetEmail } from '../../lib/api/requestResetEmail';
import { resetPassword } from '../../lib/api/resetPassword';

vi.mock('../../lib/api/login');
vi.mock('../../lib/api/requestResetEmail');
vi.mock('../../lib/api/resetPassword');

const api = {
	login,
	requestResetEmail,
	resetPassword,
};

let service: any;

const createService = () => {
	const machine = createLoginMachine({ api });
	const service = interpret(machine);

	service.start();

	return service;
};

describe('login machine', () => {
	service = createService();

	beforeEach(() => {
		service = createService();
	});

	it('tracks email state', async () => {
		service.send('EMAIL', { value: 'new_email' });

		await waitFor(() => {
			expect(service.state.context.email).toBe('new_email');
		});
	});

	it('sends login request', async () => {
		service.start();

		service.send('EMAIL', { value: 'the_email' });
		service.send('PASSWORD', { value: 'the_password' });
		service.send('LOGIN');

		await waitFor(() => {
			expect(api.login).toBeCalled();
		});
	});
});

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
});
