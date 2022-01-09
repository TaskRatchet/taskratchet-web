import createLoginMachine, { LoginContext } from './Login.machine';
import api, { LegacyApi } from '../../lib/LegacyApi';
import { EventObject, interpret, Interpreter, StateSchema } from 'xstate';
import { renderWithQueryProvider } from '../../lib/test/helpers';
import Login from './Login';
import React from 'react';
import userEvent from '@testing-library/user-event';

let service: Interpreter<
		LoginContext,
		StateSchema<LoginContext>,
		EventObject & { value: string }
	>,
	mockApi: LegacyApi;

const createService = () => {
	const machine = createLoginMachine({ api: mockApi });
	const service = interpret(machine);

	service.start();

	return service;
};

const createMockApi = () => {
	const mockApi = api;

	mockApi.login = jest.fn();
	mockApi.requestResetEmail = jest.fn();

	return mockApi;
};

describe('login machine', () => {
	service = createService();
	mockApi = createMockApi();

	beforeEach(() => {
		service = createService();
		mockApi = createMockApi();
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

		expect(mockApi.login).toBeCalled();
	});
});

describe('login form', () => {
	it('sends login request', async () => {
		const { getByLabelText, getByText } = renderWithQueryProvider(<Login />);

		userEvent.type(getByLabelText('Email'), 'the_email');
		userEvent.type(getByLabelText('Password'), 'the_password');
		userEvent.click(getByText('Submit'));

		expect(mockApi.login).toBeCalled();
	});

	it('sends reset request', async () => {
		const { getByLabelText, getByText } = renderWithQueryProvider(<Login />);

		userEvent.type(getByLabelText('Email'), 'the_email');
		userEvent.click(getByText('Reset Password'));

		expect(mockApi.requestResetEmail).toBeCalled();
	});
});
