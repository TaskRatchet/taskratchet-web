import React from 'react';
import Cookies from 'universal-cookie';
import Api from '../../../classes/Api';
import Toaster from '../../../classes/Toaster';
import './style.css'

const cookies = new Cookies();

interface LoginProps {
    onLogin: () => void,
    session: Session | null,
    api: Api
}

interface LoginState {
    email: string,
    password: string
}

class Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = {
        email: '',
        password: ''
    };

    toaster: Toaster = new Toaster();

    login = (event: any) => {
        event.preventDefault();

        const passes = this.validateLoginForm();

        if (!passes) return;

        this.toaster.send('Logging in...');

        this.props.api.login(this.state.email, this.state.password)
            .then((res: any) => {
                if (res.status === 403) {
                    this.pushMessage('Login failed');
                } else {
                    this.pushMessage('Login successful');
                    res.text().then(this.handleLogin);
                }
            })
    };

    handleLogin = (token: string) => {
        cookies.set('tr_session', {
            'token': token,
            'email': this.state.email
        }, {
            'sameSite': 'lax'
        });
        this.props.onLogin();
    };

    reset = (event: any) => {
        event.preventDefault();

        const passes = this.validateLoginForm(false);

        if (!passes) return;

        this.props.api.requestResetEmail(this.state.email)
            .then((res: any) => {
                if (res.ok) {
                    this.pushMessage('Instructions sent to ' + this.state.email);
                } else {
                    this.pushMessage('Reset request failed');
                    res.text().then((t: string) => console.log(t))
                }
            })
    };

    validateLoginForm = (passwordRequired = true) => {
        let passes = true;

        if (!this.state.email) {
            this.pushMessage('Email required');
            passes = false;
        }

        if (passwordRequired && !this.state.password) {
            this.pushMessage('Password required');
            passes = false;
        }

        return passes;
    };

    setLoginEmail = (event: any) => {
        const t = event.target;
        this.setState((prev: LoginState) => {
            prev.email = t.value;
            return prev;
        })
    };

    setLoginPassword = (event: any) => {
        const t = event.target;
        this.setState((prev: LoginState) => {
            prev.password = t.value;
            return prev;
        })
    };

    pushMessage = (msg: string) => {
        this.toaster.send(msg)
    };

    render() {
        return <div className={'organism-login'}>
            {
                this.props.session ?
                    <p>You are logged in as {this.props.session.email}</p>
                    :
                    <form>
                        <input
                            type="email"
                            value={this.state.email}
                            onChange={this.setLoginEmail}
                            name={'email'}
                            placeholder={'Email'}
                        />

                        <input
                            type="password"
                            value={this.state.password}
                            onChange={this.setLoginPassword}
                            name={'password'}
                            placeholder={'Password'}
                        />

                        <input type="submit" value={'Submit'} onClick={this.login} />
                        <input type="submit" value={'Reset Password'} onClick={this.reset} />
                    </form>
            }
        </div>
    }
}

export default Login;
