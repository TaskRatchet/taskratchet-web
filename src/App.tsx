import React, {FormEvent} from 'react';
import './App.css';
import LoginForm from './components/pages/Login'
import RegisterForm from './components/pages/Register';
import Cookies from 'universal-cookie';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Register from './components/pages/Register';

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
        return <Router>
            <nav>
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/login'}>Login</Link></li>
                    <li><Link to={'/register'}>Register</Link></li>
                </ul>
            </nav>

            <Switch>
                <Route path={'/login'}><LoginForm /></Route>
                <Route path={'/register'}><RegisterForm /></Route>
                <Route path={'/'}><h1>Home</h1></Route>
            </Switch>
        </Router>
    }
}

export default App;
