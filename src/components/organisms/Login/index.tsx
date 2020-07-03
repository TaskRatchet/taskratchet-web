import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import Api from '../../../classes/Api';
import Toaster from '../../../classes/Toaster';
import {createMachine, interpret} from 'xstate';
import './style.css'
import {useMachine} from '@xstate/react';

const cookies = new Cookies();

// https://xstate.js.org/viz/
const loginMachine = createMachine(
    {
        id: 'login',
        initial: 'idle',
        states: {
            idle: {
                on: {
                    LOGIN: 'validatingLogin',
                    RESET: 'validatingReset'
                }
            },
            validatingLogin: {
                onEntry: 'validateLogin',
                on: {
                    PASS: 'authenticating',
                    FAIL: 'invalid'
                }
            },
            validatingReset: {
                onEntry: 'validateReset',
                on: {
                    PASS: 'resetting',
                    FAIL: 'invalid'
                }
            },
            invalid: {
                on: {
                    LOGIN: 'validatingLogin',
                    RESET: 'validatingReset'
                }
            },
            authenticating: {
                onEntry: 'login',
                on: {
                    SUCCESS: 'idle',
                    ERROR: 'error'
                }
            },
            resetting: {
                onEntry: 'reset',
                on: {
                    SUCCESS: 'idle',
                    ERROR: 'error'
                }
            },
            error: {
                on: {
                    LOGIN: 'validatingLogin',
                    RESET: 'validatingReset'
                }
            }
        }
    }
)

interface LoginProps {
    onLogin: () => void,
    session: Session | null,
    api: Api
}

const Login = (props: LoginProps) => {
    const [state, send] = useMachine(loginMachine);

    console.log(state.value);
    console.log(state.actions);

    const [email, setEmail] = useState<string>(''),
        [password, setPassword] = useState<string>('');

    const toaster: Toaster = new Toaster();

    const actionHandlers: { [key: string]: () => void } = {
        "validateLogin": () => validateLoginForm(),
        "validateReset": () => validateLoginForm(false),
        "login": () => login(),
        "reset": () => reset(),
    }

    useEffect(() => {
        console.log('state change');
        state.actions.forEach(action => {
            console.log(action.type);
            if (action.type in actionHandlers) {
                actionHandlers[action.type]();
            }
        })
    }, [state])

    const login = () => {
        props.api.login(email, password)
            .then((res: any) => {
                if (res.ok) {
                    send('SUCCESS')
                    res.text().then(handleLoginResponse);
                } else {
                    send('ERROR')
                    toaster.send('Login failed');
                }
            })
    };

    const handleLoginResponse = (token: string) => {
        cookies.set('tr_session', {
            'token': token,
            'email': email
        }, {
            'sameSite': 'lax'
        });
        props.onLogin();
    };

    const reset = () => {
        props.api.requestResetEmail(email)
            .then((res: any) => {
                if (res.ok) {
                    send('SUCCESS')
                    toaster.send('Instructions sent to ' + email);
                } else {
                    send('ERROR')
                    toaster.send('Reset request failed');
                    res.text().then((t: string) => console.log(t))
                }
            })
    };

    const validateLoginForm = (passwordRequired = true) => {
        if (!email) {
            toaster.send('Email required');
            send('FAIL')
            return
        }

        if (passwordRequired && !password) {
            toaster.send('Password required');
            send('FAIL')
            return
        }

        send('PASS')
    };

    const isLoading = () => {
        return state.matches('authenticating') || state.matches('resetting');
    }

    return <div className={`organism-login ${isLoading() ? 'loading' : ''}`}>
        {
            props.session ?
                <p>You are logged in as {props.session.email}</p>
                :
                <form>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        name={'email'}
                        placeholder={'Email'}
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        name={'password'}
                        placeholder={'Password'}
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
