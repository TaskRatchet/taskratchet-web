import React, {FormEvent} from 'react';
import './App.css';
import LoginForm from './components/pages/Login'
import RegisterForm from './components/pages/Register';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

type User = {
    email: string
}

interface AppProps {
}

interface AppState {
    user: User | null,
}

class App extends React.Component<AppProps, {}> {
    state: AppState = {
        user: null,
    };

    componentDidMount(): void {
        document.title = 'TaskRatchet';

        console.log(cookies.get('tr_session'));
    }

    render() {
        return <div>
            <h1>Login</h1>
            <LoginForm />

            <h1>Register</h1>
            <RegisterForm />

            <h1>Tasks</h1>
        </div>
    }
}

export default App;
