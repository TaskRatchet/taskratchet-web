import React from 'react';
import './App.css';
import LoginForm from './components/pages/Login'
import RegisterForm from './components/pages/Register';
import Tasks from './components/pages/Tasks';
import Cookies from 'universal-cookie';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const cookies = new Cookies();

interface AppProps {
}

interface AppState {
    session: Session | null,
}

class App extends React.Component<AppProps, {}> {
    state: AppState = {
        session: null,
    };

    componentDidMount(): void {
        document.title = 'TaskRatchet';

        this.updateSession()
    }

    updateSession = () => {
        this.setState({
            session: cookies.get('tr_session')
        })
    };

    logOut = () => {
        cookies.remove('tr_session');
        this.updateSession();
    };

    render() {
        return <div>
            <Router>
                <p>
                    {this.state.session ? this.state.session.email + ' - ' : ''}
                    {this.state.session ? this.state.session.token + ' - ' : ''}
                    {
                        this.state.session ?
                            <button onClick={this.logOut}>Logout</button> :
                            <span>
                                <Link to={'/login'}>Login</Link> -&nbsp;
                                <Link to={'/register'}>Register</Link>
                            </span>
                    }
                </p>

                <h2><Link to={'/'}>TaskRatchet</Link></h2>

                <Switch>
                    <Route path={'/login'}><LoginForm onLogin={this.updateSession}/></Route>
                    <Route path={'/register'}><RegisterForm/></Route>
                    <Route path={'/'}><Tasks session={this.state.session} /></Route>
                </Switch>
            </Router>
        </div>
    }
}

export default App;
