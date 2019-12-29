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
    Link,
} from "react-router-dom";
import SessionWidget from './components/molecules/SessionWidget'
import Account from './components/pages/Account'
import Authenticated from './components/pages/Authenticated'

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
                <SessionWidget session={this.state.session} logOutHandler={this.logOut} />

                <h2><Link to={'/'}>TaskRatchet</Link></h2>

                <Switch>
                    <Route path={'/login'}>
                        <LoginForm onLogin={this.updateSession} session={this.state.session} />
                    </Route>

                    <Route path={'/register'}>
                        <RegisterForm/>
                    </Route>

                    <Route path={'/success'}>
                        You've been registered successfully.
                    </Route>

                    <Route path={'/cancel'}>
                        You canceled before your registration was completed. Please contact <a href="mailto:nathan@taskratchet.com" target={'_blank'}>nathan@taskratchet.com</a> if you wish to restart your registration.
                    </Route>

                    <Route path={'/account'}>
                        <Authenticated session={this.state.session}>
                            <Account/>
                        </Authenticated>
                    </Route>

                    <Route path={'/'}>
                        <Authenticated session={this.state.session}>
                            <Tasks />
                        </Authenticated>
                    </Route>
                </Switch>
            </Router>
        </div>
    }
}

export default App;
