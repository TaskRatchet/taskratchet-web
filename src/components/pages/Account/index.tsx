import React from 'react';
import Cookies from 'universal-cookie';
import Api from '../../../Api';
import './style.css'

const cookies = new Cookies();

interface AccountProps {
}

interface AccountState {
    messages: string[],
    name: string,
    email: string,
    oldPassword: string,
    password: string,
    password2: string,
    timezones: string[],
    timezone: string,
}

class Account extends React.Component<AccountProps, AccountState> {
    state: AccountState = {
        messages: [],
        name: '',
        email: '',
        oldPassword: '',
        password: '',
        password2: '',
        timezones: [],
        timezone: '',
    };

    api: Api = new Api();

    componentDidMount(): void {
        this.populateTimezones();
        this.loadUser();
    }

    populateTimezones = () => {
        this.api.getTimezones()
            .then((res: any) => res.json())
            .then((data) => {
                this.setState((prev: AccountState) => {
                    prev.timezones = data;
                    return prev;
                });
            });
    };

    loadUser = () => {
        this.api.getMe()
            .then((res: any) => res.json())
            .then((data) => {
                this.setState((prev: AccountState) => {
                    prev.name = data['name'];
                    prev.email = data['email'];
                    prev.timezone = data['timezone'];
                    return prev;
                })
            })
    };

    setName = (event: any) => {
        const t = event.target;
        this.setState((prev: AccountState) => {
            prev.name = t.value;
            return prev;
        })
    };

    setEmail = (event: any) => {
        const t = event.target;
        this.setState((prev: AccountState) => {
            prev.email = t.value;
            return prev;
        })
    };

    setOldPassword = (event: any) => {
        const t = event.target;
        this.setState((prev: AccountState) => {
            prev.oldPassword = t.value;
            return prev;
        })
    };

    setPassword = (event: any) => {
        const t = event.target;
        this.setState((prev: AccountState) => {
            prev.password = t.value;
            return prev;
        })
    };

    setPassword2 = (event: any) => {
        const t = event.target;
        this.setState((prev: AccountState) => {
            prev.password2 = t.value;
            return prev;
        })
    };

    setTimezone = (event: any) => {
        const t = event.target;
        this.setState((prev: AccountState) => {
            prev.timezone = t.value;
            return prev;
        })
    };

    render() {
        return <form className={'page-account'}>
            <h1>Account</h1>

            <input
                type="text"
                value={this.state.name}
                onChange={this.setName}
                name={'name'}
                placeholder={'Name'}
            /><br/>

            <input
                type="email"
                value={this.state.email}
                onChange={this.setEmail}
                name={'email'}
                placeholder={'Email'}
            /><br/>



            <select name="timezone" value={this.state.timezone} onChange={this.setTimezone}>
                {this.state.timezones.map((tz, i) => <option value={tz} key={i}>{tz}</option>)}
            </select><br/>

            <h2>Reset Password</h2>

            <input
                type="password"
                value={this.state.oldPassword}
                onChange={this.setOldPassword}
                name={'old_password'}
                placeholder={'Old Password'}
            /><br/>

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
        </form>
    }
}

export default Account;
