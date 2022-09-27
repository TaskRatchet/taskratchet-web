/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
	assign,
	createMachine,
	EventObject,
	InternalMachineOptions,
	MachineConfig,
	StateMachine,
	StateSchema,
} from 'xstate';
import { login } from '../../lib/api/login';
import { requestResetEmail } from '../../lib/api/requestResetEmail';

const live_api = {
	login,
	requestResetEmail,
};

// https://xstate.js.org/viz/

// TODO: Replace this machine with react-query

export interface LoginContext {
	api: typeof live_api;
	email: string;
	password: string;
	emailError: string;
	passwordError: string;
	message: string;
}

interface CreateLoginMachineOptions {
	api?: typeof live_api;
}

const createLoginMachine = (
	options: CreateLoginMachineOptions = {}
): StateMachine<
	LoginContext,
	StateSchema<LoginContext>,
	EventObject & { value: string }
> => {
	const { api = live_api } = options;

	const conf: MachineConfig<
		LoginContext,
		StateSchema<LoginContext>,
		EventObject & { value: string }
	> = {
		id: 'login',
		initial: 'idle',
		context: {
			api: api,
			email: '',
			password: '',
			emailError: '',
			passwordError: '',
			message: '',
		} as LoginContext,
		states: {
			idle: {
				entry: 'validateForm',
				exit: 'clearMessages',
				on: {
					LOGIN: [
						{ target: 'authenticating', cond: 'isLoginValid' },
						{ target: 'idle' },
					],
					RESET: [
						{ target: 'resetting', cond: 'isResetValid' },
						{ target: 'idle' },
					],
					EMAIL: { actions: 'setEmail' },
					PASSWORD: { actions: 'setPassword' },
				},
			},
			authenticating: {
				invoke: {
					id: 'login',
					src: 'loginService',
					onDone: {
						target: 'idle',
						actions: 'storeLoginResponse',
					},
				},
			},
			resetting: {
				invoke: {
					id: 'reset',
					src: 'resetService',
					onDone: {
						target: 'idle',
						actions: 'storeResetResponse',
					},
				},
			},
		},
	} as any;

	const opts: InternalMachineOptions<
		LoginContext,
		EventObject & { value: string },
		unknown
	> = {
		services: {
			loginService: (ctx: LoginContext) => {
				return ctx.api.login(ctx.email, ctx.password);
			},
			resetService: (ctx: LoginContext) => ctx.api.requestResetEmail(ctx.email),
		},
		guards: {
			isLoginValid: (context: LoginContext) => {
				return !!context.email && !!context.password;
			},
			isResetValid: (context: LoginContext) => !!context.email,
		},
		actions: {
			validateForm: assign((context: LoginContext, event) => {
				const shouldValidate = ['LOGIN', 'RESET'].includes(event.type),
					isEmailMissing = !context.email,
					isLoginEvent = event.type === 'LOGIN',
					isPasswordMissing = isLoginEvent && !context.password;

				if (!shouldValidate) return {};

				return {
					emailError: isEmailMissing ? 'Email required' : '',
					passwordError: isPasswordMissing ? 'Password required' : '',
				};
			}),
			clearMessages: assign({
				emailError: '',
				passwordError: '',
				message: '',
			} as unknown as LoginContext),
			setEmail: assign({
				email: (ctx: LoginContext, e: { value: string }): string => e.value,
			} as unknown as LoginContext),
			setPassword: assign({
				password: (ctx: LoginContext, e: { value: string }): string => e.value,
			} as unknown as LoginContext),
			storeLoginResponse: assign({
				message: (ctx: LoginContext, e: { data: Response }) =>
					!e.data ? 'Login failed' : '',
			} as unknown as LoginContext),
			storeResetResponse: assign({
				message: (ctx: LoginContext, e: { data: Response }) =>
					!e.data.ok ? 'Reset failed' : `Instructions sent to ${ctx.email}`,
			} as unknown as LoginContext),
		},
	} as any;

	return createMachine(conf, opts) as any;
};

export default createLoginMachine;
