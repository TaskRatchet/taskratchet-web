import React from 'react';
import Api from '../../../Api';
import {useLocation} from 'react-router-dom';

interface ResetPasswordState {
    messages: string[],
    password: string,
    password2: string,
}

class ResetPassword extends React.Component<{}, ResetPasswordState> {
    state: ResetPasswordState = {
        messages: [],
        password: '',
        password2: '',
    };

    api: Api = new Api();

    componentDidMount(): void {
    }

    setPassword = (event: any) => {
        const t = event.target;
        this.setState((prev: ResetPasswordState) => {
            prev.password = t.value;
            return prev;
        })
    };

    setPassword2 = (event: any) => {
        const t = event.target;
        this.setState((prev: ResetPasswordState) => {
            prev.password2 = t.value;
            return prev;
        })
    };

    resetPassword = (event: any) => {
        event.preventDefault();

        this.clearMessages();
        const passes = this.validateForm();

        if (!passes) return;

        this.api.resetPassword(
            this.getToken(),
            this.state.password,
        )
            .then((res: any) => {
                if (res.ok) {
                    this.pushMessage('Password reset successfully');
                } else {
                    this.pushMessage('Password reset failed');
                    res.text().then((t: string) => console.log(t));
                }
            })
    };

    getToken = () => {
        let query = new URLSearchParams(useLocation().search);

        return query.get('token') || '';
    };

    pushMessage = (msg: string) => {
        this.setState((prev: ResetPasswordState) => {
            prev.messages.push(msg);
            return prev;
        });
    };

    clearMessages = () => {
        this.setState((prev: ResetPasswordState) => {
            prev.messages = [];
            return prev;
        });
    };

    validateForm = () => {
        let passes = true;

        if (!this.state.password || !this.state.password2) {
            this.pushMessage("Please enter new password twice");
            passes = false;
        }

        if (this.state.password !== this.state.password2) {
            this.pushMessage("Passwords don't match");
            passes = false;
        }

        return passes;
    };

    render() {
        return <form onSubmit={this.resetPassword}>
            <h1>Reset Password</h1>

            {this.state.messages.map((msg, i) => <p key={i}>{msg}</p>)}

            <input
                type="password"
                value={this.state.password}
                onChange={this.setPassword}
                name={'password'}
                placeholder={'Password'}
            /><br/>

            <input
                type="password"
                value={this.state.password2}
                onChange={this.setPassword2}
                name={'password2'}
                placeholder={'Retype Password'}
            /><br/>

            <input type="submit" value={'Save new password'} />
        </form>
    }
}

export default ResetPassword;