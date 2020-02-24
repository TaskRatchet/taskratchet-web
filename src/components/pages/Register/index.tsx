import React from 'react';
import Api from '../../../classes/Api';

interface RegisterState {
    messages: string[],
    name: string,
    email: string,
    password: string,
    password2: string,
    timezones: string[],
    timezone: string,
    checkoutSession: {
        id: string
    } | null,
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
        checkoutSession: null,
    };

    api: Api = new Api();

    componentDidMount(): void {
        this.populateTimezones();
        this.loadCheckoutSession();
    }

    populateTimezones = () => {
        this.api.getTimezones()
            .then((res: any) => res.json())
            .then((data) => {
                this.setState((prev: RegisterState) => {
                    prev.timezones = data;
                    prev.timezone = data[0];
                    return prev;
                });
            });
    };

    loadCheckoutSession = () => {
        this.api.getCheckoutSession()
            .then((res: any) => res.json())
            .then((session) => {
                this.setState((prev: RegisterState) => {
                    prev.checkoutSession = session;
                    return prev;
                });
            })
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

        this.api.register(
            this.state.name,
            this.state.email,
            this.state.password,
            this.state.timezone,
            this.getSessionId(),
        )
            .then((res: any) => {
                if (res.ok) {
                    this.pushMessage('Redirecting...')
                } else {
                    this.pushMessage('Registration failed')
                }
                return res.json()
            })
            .then(res => {
                console.log(res);
            });

        this.redirect();
    };

    redirect = () => {
        if (this.state.checkoutSession == null) return;

        const stripe = window.Stripe('pk_live_inP66DVvlOOA4r3CpaD73dFo00oWsfSpLd');

        stripe.redirectToCheckout({
            sessionId: this.getSessionId()
        }).then((result: any) => {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
            this.pushMessage(result.error.message);

            console.log('Checkout redirect error');
            console.log(result);
        });
    };

    getSessionId = () => {
        if (this.state.checkoutSession == null) return null;

        return this.state.checkoutSession.id;
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
            <h1>Register</h1>

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

            <p>Pressing the button below will redirect you to our payments provider to add your payment method.</p>

            <input type="submit" value={'Add payment method'} disabled={this.state.checkoutSession == null} />
        </form>
    }
}

export default Register;