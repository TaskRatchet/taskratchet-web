import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import Api from '../../../classes/Api';
import Toaster from '../../../classes/Toaster';
import {createMachine, interpret} from 'xstate';
import './style.css'
import {useMachine} from '@xstate/react';

const cookies = new Cookies();

// https://xstate.js.org/viz/
const loginMachine = createMachine({
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
            on: {
                PASS: 'authenticating',
                FAIL: 'invalid'
            }
        },
        validatingReset: {
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
            on: {
                SUCCESS: 'idle',
                ERROR: 'error'
            }
        },
        resetting: {
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
})

interface LoginProps {
    onLogin: () => void,
    session: Session | null,
    api: Api
}

const Login = (props: LoginProps) => {
    const [state, send] = useMachine(loginMachine);

    console.log(state.value);

    const [email, setEmail] = useState<string>(''),
        [password, setPassword] = useState<string>('');

    const toaster: Toaster = new Toaster();

    const login = (event: any) => {
        send('LOGIN');

        event.preventDefault();

        const passes = validateLoginForm();

        if (!passes) return;

        toaster.send('Logging in...');

        props.api.login(email, password)
            .then((res: any) => {
                if (res.status === 403) {
                    send('ERROR')
                    toaster.send('Login failed');
                } else {
                    send('SUCCESS')
                    toaster.send('Login successful');
                    res.text().then(handleLoginResponse);
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

    const reset = (event: any) => {
        send('RESET')

        event.preventDefault();

        const passes = validateLoginForm(false);

        if (!passes) return;

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
        let passes = true;

        if (!email) {
            toaster.send('Email required');
            passes = false;
        }

        if (passwordRequired && !password) {
            toaster.send('Password required');
            passes = false;
        }

        send(passes ? 'PASS' : 'FAIL')

        return passes;
    };

    const isLoading = () => {
        return state.matches('authenticating') || state.matches('resetting');
    }

    return <div className={`organism-login ${isLoading() ? 'loading': ''}`}>
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

                    <input type="submit" value={'Submit'} onClick={login}/>
                    <input type="submit" value={'Reset Password'} onClick={reset}/>
                </form>
        }
    </div>
}

export default Login;
