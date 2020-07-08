import React from 'react';
import api from '../../../classes/Api';
import {assign, createMachine} from 'xstate';
import './style.css'
import {useMachine} from '@xstate/react';
import Input from "../../molecules/Input";

interface LoginContext {
    email: string,
    password: string,
    emailError: string,
    passwordError: string,
    message: string
}

// https://xstate.js.org/viz/
const loginMachine = createMachine(
    {
        id: 'login',
        initial: 'idle',
        context: {
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
                        {target: 'authenticating', cond: 'isLoginValid'},
                        {target: 'idle'}
                    ],
                    RESET: [
                        {target: 'resetting', cond: 'isResetValid'},
                        {target: 'idle'}
                    ],
                    EMAIL: {actions: 'setEmail'},
                    PASSWORD: {actions: 'setPassword'},
                }
            },
            authenticating: {
                invoke: {
                    id: 'login',
                    src: 'loginService',
                    onDone: {
                        target: 'idle',
                        actions: 'storeLoginResponse'
                    },
                }
            },
            resetting: {
                invoke: {
                    id: 'reset',
                    src: 'resetService',
                    onDone: {
                        target: 'idle',
                        actions: 'storeResetResponse'
                    }
                }
            },
        }
    },
    {
        services: {
            loginService: (ctx: LoginContext, e: any) => api.login(ctx.email, ctx.password),
            resetService: (ctx: LoginContext, e: any) => api.requestResetEmail(ctx.email),
        },
        guards: {
            isLoginValid: (context: LoginContext) => !!context.email && !!context.password,
            isResetValid: (context: LoginContext) => !!context.email,
        },
        actions: {
            validateForm: assign((context: LoginContext, event) => {
                const shouldValidate = ['LOGIN', 'RESET'].includes(event.type),
                    isEmailMissing = !context.email,
                    isLoginEvent = event.type === 'LOGIN',
                    isPasswordMissing = isLoginEvent && !context.password;

                if (!shouldValidate) return {}

                return {
                    emailError: isEmailMissing ? 'Email required' : '',
                    passwordError: isPasswordMissing ? 'Password required' : ''
                }
            }),
            clearMessages: assign({
                emailError: '',
                passwordError: '',
                message: '',
            } as any),
            setEmail: assign({
                'email': (ctx: any, e: any): string => e.value
            } as any),
            setPassword: assign({
                'password': (ctx: any, e: any): string => e.value
            } as any),
            storeLoginResponse: assign({
                message: (ctx: any, e: any) => (!e.data) ? 'Login failed' : ''
            } as any),
            storeResetResponse: assign({
                message: (ctx: any, e: any) => (!e.data.ok) ? 'Reset failed' : `Instructions sent to ${ctx.email}`
            } as any),
        },
    }
)

const Login = () => {
    const [state, send] = useMachine(loginMachine),
        session = api.getSession();

    const isLoading = () => {
        return state.matches('authenticating') || state.matches('resetting');
    }

    return <div className={`organism-login ${isLoading() ? 'loading' : ''}`}>
        {
            session ?
                <p>You are logged in as {session.email}</p>
                :
                <form>
                    {
                        state.context.message ?
                            <div className={'organism-login__message alert info'}>{state.context.message}</div> : ''
                    }

                    <Input
                        id={'email'}
                        type={'email'}
                        value={state.context.email}
                        onChange={e => send({
                            type: 'EMAIL',
                            value: e.target.value
                        } as any)}
                        label={'Email'}
                        error={state.context.emailError}
                    />

                    <Input
                        id={'password'}
                        type={'password'}
                        value={state.context.password}
                        onChange={e => send({
                            type: 'PASSWORD',
                            value: e.target.value
                        } as any)}
                        label={'Password'}
                        error={state.context.passwordError}
                    />

                    <input type="submit" value={'Submit'} onClick={e => {
                        e.preventDefault();
                        send('LOGIN');
                    }}/>
                    <input type="submit" value={'Reset Password'} onClick={e => {
                        e.preventDefault();
                        send('RESET');
                    }}/>
                </form>
        }
    </div>
}

export default Login;
