import React from 'react';
import api from '../../../classes/Api';
import './style.css'
import {useMachine} from '@xstate/react';
import Input from "../../molecules/Input";
import machine from './machine'

const Login = () => {
    const [state, send] = useMachine(machine),
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
