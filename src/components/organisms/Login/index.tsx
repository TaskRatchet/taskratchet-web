import React from 'react';
import Cookies from 'universal-cookie';
import Api from '../../../Api';
import './style.css'

const cookies = new Cookies();

interface LoginProps {
    onLogin: () => void,
    session: Session | null
}

interface LoginState {
    messages: string[],
    email: string,
    password: string
}

class Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = {
        messages: [],
        email: '',
        password: ''
    };

    api: Api = new Api();

    login = (event: any) => {
        event.preventDefault();

        console.log('logging in', this.state);

        this.clearMessages();
        const passes = this.validateLoginForm();

        if (!passes) return;

        this.api.login(this.state.email, this.state.password)
            .then((res: any) => {
                if (res.status === 403) {
                    this.pushMessage('Login failed');
                } else {
                    this.pushMessage('Login successful');
                    return res.text();
                }
            })
            .then((res: any) => {
                console.log(res);
                cookies.set('tr_session', {
                    'token': res,
                    'email': this.state.email,
                    'options': {
                        'sameSite': 'lax'
                    }
                });
                this.props.onLogin()
            });
    };

    reset = (event: any) => {
        event.preventDefault();

        const passes = this.validateLoginForm(false);

        if (!passes) return;

        this.api.requestResetEmail(this.state.email)
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

    clearMessages = () => {
        this.setState((prev: LoginState) => {
            prev.messages = [];
            return prev;
        });
    };

    pushMessage = (msg: string) => {
        this.setState((prev: LoginState) => {
            prev.messages.push(msg);
            return prev;
        });
    };

    render() {
        return <div className={'organism-login'}>
            {this.state.messages.map((msg, i) => <p key={i}>{msg}</p>)}

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
