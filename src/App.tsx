import React, {FormEvent} from 'react';
import './App.css';
import LoginForm from './components/molecules/Login'
import RegisterForm from './components/molecules/Register';

type User = {
    email: string
}

interface AppProps {
}

interface AppState {
    user: User | null,
    messages: string[],
    loginForm: {
        email: string,
        password: string
    },
    registerForm: {
        email: string,
        password: string,
        password2: string,
    }
}

class App extends React.Component<AppProps, {}> {
    state: AppState = {
        user: null,
        messages: [],
        loginForm: {
            email: '',
            password: ''
        },
        registerForm: {
            email: '',
            password: '',
            password2: ''
        }
    };

    login = (event: any) => {
        event.preventDefault();

        console.log('logging in', this.state.loginForm);

        this.clearMessages();
        this.validateLoginForm();
    };

    validateLoginForm = () => {
        if (!this.state.loginForm.email) {
            this.pushMessage('Email required')
        }

        if (!this.state.loginForm.password) {
            this.pushMessage('Password required')
        }
    };

    setLoginEmail = (event: any) => {
        const t = event.target;
        this.setState((prev: AppState) => {
            prev.loginForm.email = t.value;
            return prev;
        })
    };

    setLoginPassword = (event: any) => {
        const t = event.target;
        this.setState((prev: AppState) => {
            prev.loginForm.password = t.value;
            return prev;
        })
    };

    setRegisterEmail = (event: any) => {
        const t = event.target;
        this.setState((prev: AppState) => {
            prev.registerForm.email = t.value;
            return prev;
        })
    };

    setRegisterPassword = (event: any) => {
        const t = event.target;
        this.setState((prev: AppState) => {
            prev.registerForm.password = t.value;
            return prev;
        })
    };

    setRegisterPassword2 = (event: any) => {
        const t = event.target;
        this.setState((prev: AppState) => {
            prev.registerForm.password2 = t.value;
            return prev;
        })
    };

    register = (event: any) => {
        event.preventDefault();

        console.log('registering', this.state.registerForm);

        this.clearMessages();
        this.validateRegistrationForm();
    };

    clearMessages = () => {
        this.setState((prev: AppState) => {
            prev.messages = [];
            return prev;
        });
    };

    validateRegistrationForm = () => {
        if (!this.state.registerForm.email) {
            this.pushMessage("Email missing")
        }

        if (!this.state.registerForm.password || !this.state.registerForm.password2) {
            this.pushMessage("Please enter password twice")
        }

        if (this.state.registerForm.password !== this.state.registerForm.password2) {
            this.pushMessage("Passwords don't match")
        }
    };

    pushMessage = (msg: string) => {
        this.setState((prev: AppState) => {
            prev.messages.push(msg);
            return prev;
        })
    };

    logout = () => {
        this.setState((prev: AppState) => {
            prev.user = null;
            return prev;
        });
    };

    render() {
        return <div>
            {this.state.messages.map((msg, i) => <p key={i}>{msg}</p>)}

            <h1>Login</h1>
            <LoginForm
                isLoggedIn={!!this.state.user}
                email={this.state.loginForm.email}
                password={this.state.loginForm.password}
                onEmailChange={this.setLoginEmail}
                onPasswordChange={this.setLoginPassword}
                onSubmit={this.login}
            />

            <h1>Register</h1>
            <RegisterForm
                email={this.state.registerForm.email}
                password={this.state.registerForm.password}
                password2={this.state.registerForm.password2}
                onEmailChange={this.setRegisterEmail}
                onPasswordChange={this.setRegisterPassword}
                onPassword2Change={this.setRegisterPassword2}
                onSubmit={this.register}
            />
        </div>
    }
}

export default App;
