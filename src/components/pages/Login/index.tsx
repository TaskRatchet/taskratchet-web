import React from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

interface LoginState {
    messages: string[],
    email: string,
    password: string
}

class Login extends React.Component<{}, LoginState> {
    state: LoginState = {
        messages: [],
        email: '',
        password: ''
    };

    login = (event: any) => {
        event.preventDefault();

        console.log('logging in', this.state);

        this.clearMessages();
        const passes = this.validateLoginForm();

        if (!passes) return;

        fetch('https://us-central1-taskratchet.cloudfunctions.net/api1/account/login', {
            method: 'POST',
            body: JSON.stringify({
                'email': this.state.email,
                'password': this.state.password,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
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
                cookies.set('tr_session', res);
            });
    };

    validateLoginForm = () => {
        let passes = true;

        if (!this.state.email) {
            this.pushMessage('Email required');
            passes = false;
        }

        if (!this.state.password) {
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

    logout = () => {
        // this.setState((prev: LoginState) => {
        //     prev.user = null;
        //     return prev;
        // });
    };

    render() {
        return <form onSubmit={this.login}>
            <h1>Login</h1>

            {this.state.messages.map((msg, i) => <p key={i}>{msg}</p>)}

            <input
                type="email"
                value={this.state.email}
                onChange={this.setLoginEmail}
                name={'email'}
                placeholder={'Email'}
            /><br/>

            <input
                type="password"
                value={this.state.password}
                onChange={this.setLoginPassword}
                name={'password'}
                placeholder={'Password'}
            /><br/>

            <input type="submit" value={'Submit'} />
        </form>
    }
}

export default Login;
