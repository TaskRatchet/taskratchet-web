import React, {useEffect} from 'react';
import api from '../../../classes/Api';
import Toaster from '../../../classes/Toaster';
import {assign, createMachine} from 'xstate';
import './style.css'
import {useMachine} from '@xstate/react';
import Input from "../../molecules/Input";

interface LoginContext {
    email: string,
    password: string,
    emailError: string,
    passwordError: string,
    requestError: string
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
            requestError: '',
        } as LoginContext,
        states: {
            idle: {
                entry: 'validateForm',
                exit: 'clearErrors',
                on: {
                    LOGIN: [
                        {target: 'authenticating', cond: 'isLoginValid'},
                        {target: 'idle'}
                    ],
                    RESET: [
                        {target: 'resetting', cond: 'isResetValid'},
                        {target: 'idle'}
                    ],
                    EMAIL: {
                        actions: assign({
                            'email': (ctx: any, e: any): string => e.value
                        })
                    } as any,
                    PASSWORD: {
                        actions: assign({
                            'password': (ctx: any, e: any): string => e.value
                        })
                    } as any,
                }
            },
            authenticating: {
                invoke: {
                    id: 'login',
                    src: (ctx: any, e) => api.login(ctx.email, ctx.password),
                    onDone: {
                        target: 'idle',
                        actions: assign({
                            requestError: (ctx: any, e) => (!e.data) ? 'Login failed' : ''
                        })
                    },
                }
            },
            resetting: {
                entry: 'reset',
                on: {
                    RESOLVE: 'idle'
                }
            },
        }
    },
    {
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
            clearErrors: assign({
                emailError: '',
                passwordError: '',
                requestError: '',
            } as any),
            // login: assign((context: LoginContext, event) => {
            //     // async function getResponse() {
            //     //     return await api.login(context.email, context.password)
            //     // }
            //     // const response = getResponse();
            //     //
            //     // response.text().then(handleLoginResponse);
            //     //
            //     // if response.ok return {}
            //     //
            //     // return {
            //     //     requestError: 'Login failed'
            //     // }
            //
            //     return {
            //         requestError: api.login(context.email, context.password)
            //             .then((res: any) => res.ok ? '' : 'Login failed')
            //     }
            // }),
            // reset: assign((context: LoginContext, event) => {}),
        },
        guards: {
            isLoginValid: (context) => !!context.email && !!context.password,
            isResetValid: (context) => !!context.email,
        }
    }
)

const Login = () => {
    const [state, send] = useMachine(loginMachine);

    // console.log({
    //     value: state.value,
    //     actions: state.actions,
    //     context: state.context
    // })

    const toaster: Toaster = new Toaster();

    const session = api.getSession();

    const actionHandlers: { [key: string]: () => void } = {
        // "login": () => login(),
        "reset": () => reset(),
    }

    useEffect(() => {
        if (!state.changed) return;

        state.actions.forEach(action => {
            if (action.type in actionHandlers) {
                actionHandlers[action.type]();
            }
        })
    }, [state])

    const reset = () => {
        api.requestResetEmail(state.context.email)
            .then((res: any) => {
                if (res.ok) {
                    send('SUCCESS')
                    toaster.send('Instructions sent to ' + state.context.email);
                } else {
                    send('ERROR')
                    toaster.send('Reset request failed');
                    res.text().then((t: string) => console.log(t))
                }
            })
    };

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
                        state.context.requestError ?
                            <div className={'organism-login__error'}>{state.context.requestError}</div> : ''
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
