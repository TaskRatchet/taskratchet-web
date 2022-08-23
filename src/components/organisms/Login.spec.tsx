import createLoginMachine from './Login.machine';
import * as api from '../../lib/LegacyApi';
import { interpret } from 'xstate';
import { renderWithQueryProvider } from '../../lib/test/helpers';
import Login from './Login';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { screen } from '@testing-library/react';

vi.mock('../../lib/LegacyApi');

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

	it('tracks email state', () => {
		service.send('EMAIL', { value: 'new_email' });

		expect(service.state.context.email).toBe('new_email');
	});

	it('sends login request', () => {
		service.start();

		service.send('EMAIL', { value: 'the_email' });
		service.send('PASSWORD', { value: 'the_password' });
		service.send('LOGIN');

		expect(api.login).toBeCalled();
	});
});

describe('login form', () => {
	it('sends login request', () => {
		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.type(screen.getByLabelText('Password'), 'the_password');
		userEvent.click(screen.getByText('Submit'));

		expect(api.login).toBeCalled();
	});

	it('sends reset request', () => {
		renderWithQueryProvider(<Login />);

		userEvent.type(screen.getByLabelText('Email'), 'the_email');
		userEvent.click(screen.getByText('Reset Password'));

		expect(api.requestResetEmail).toBeCalled();
	});
});
