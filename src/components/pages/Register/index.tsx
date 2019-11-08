import React from 'react';

interface RegisterState {
    messages: string[],
    name: string,
    email: string,
    password: string,
    password2: string,
    timezones: string[],
    timezone: string,
}

class Register extends React.Component<{}, RegisterState> {
    state: RegisterState = {
        messages: [],
        name: '',
        email: '',
        password: '',
        password2: '',
        timezones: [],
        timezone: '',
    };

    componentDidMount(): void {
        this.populateTimezones();
    }

    populateTimezones = () => {
        fetch('https://us-central1-taskratchet.cloudfunctions.net/api1/timezones')
            .then(res => res.json())
            .then((data) => {
                this.setState((prev: RegisterState) => {
                    prev.timezones = data;
                    prev.timezone = data[0];
                    return prev;
                });
            });
    };

    setName = (event: any) => {
        const t = event.target;
        this.setState((prev: RegisterState) => {
            prev.name = t.value;
            return prev;
        })
    };

    setEmail = (event: any) => {
        const t = event.target;
        this.setState((prev: RegisterState) => {
            prev.email = t.value;
            return prev;
        })
    };

    setPassword = (event: any) => {
        const t = event.target;
        this.setState((prev: RegisterState) => {
            prev.password = t.value;
            return prev;
        })
    };

    setPassword2 = (event: any) => {
        const t = event.target;
        this.setState((prev: RegisterState) => {
            prev.password2 = t.value;
            return prev;
        })
    };

    setTimezone = (event: any) => {
        const t = event.target;
        this.setState((prev: RegisterState) => {
            prev.timezone = t.value;
            return prev;
        })
    };

    register = (event: any) => {
        event.preventDefault();

        console.log('registering', this.state);

        this.clearMessages();
        const passes = this.validateRegistrationForm();

        if (!passes) return;

        console.log('posting registration');

        fetch('https://us-central1-taskratchet.cloudfunctions.net/api1/account/register', {
            method: 'POST',
            body: JSON.stringify({
                'name': this.state.name,
                'email': this.state.email,
                'password': this.state.password,
                'timezone': this.state.timezone
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                this.pushMessage('Registration successful')
            } else {
                this.pushMessage('Registration failed')
            }
            return res.json()
        }).then(res => {
            console.log(res);
        });
    };

    pushMessage = (msg: string) => {
        this.setState((prev: RegisterState) => {
            prev.messages.push(msg);
            return prev;
        });
    };

    clearMessages = () => {
        this.setState((prev: RegisterState) => {
            prev.messages = [];
            return prev;
        });
    };

    validateRegistrationForm = () => {
        let passes = true;

        if (!this.state.email) {
            this.pushMessage("Email missing");
            passes = false;
        }

        if (!this.state.password || !this.state.password2) {
            this.pushMessage("Please enter password twice");
            passes = false;
        }

        if (this.state.password !== this.state.password2) {
            this.pushMessage("Passwords don't match");
            passes = false;
        }

        return passes;
    };

    render() {
        return <form onSubmit={this.register}>
            {this.state.messages.map((msg, i) => <p key={i}>{msg}</p>)}

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

            <select name="timezone" value={this.state.timezone} onChange={this.setTimezone}>
                {this.state.timezones.map((tz, i) => <option value={tz} key={i}>{tz}</option>)}
            </select><br/>

            <input type="submit" value={'Register'} />
        </form>
    }
}

export default Register;