import React from 'react';
import './App.css';
import RegisterForm from './components/pages/Register';
import Tasks from './components/pages/Tasks';
import Cookies from 'universal-cookie';
import ReactGA from 'react-ga'
import {
    Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import SessionWidget from './components/molecules/SessionWidget'
import Account from './components/pages/Account'
import Authenticated from './components/pages/Authenticated'
import ResetPassword from "./components/pages/ResetPassword";
import createHistory from 'history/createBrowserHistory'

const cookies = new Cookies();

ReactGA.initialize('G-Y074NE79ML');

const history = createHistory();
history.listen(location => {
    ReactGA.set({page: location.pathname});
    ReactGA.pageview(location.pathname);
});

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

        this.updateSession();

        ReactGA.pageview(window.location.pathname);
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
        return <div className={'page-base'}>
            <Router history={history}>
                <SessionWidget session={this.state.session} logOutHandler={this.logOut} />

                <h2><Link to={'/'}>TaskRatchet</Link></h2>

                <div className={'page-base__content'}>
                    <Switch>
                        <Route path={'/register'}>
                            <RegisterForm/>
                        </Route>

                        <Route path={'/success'}>
                            Your payment method has been saved successfully.
                        </Route>

                        <Route path={'/cancel'}>
                            Your payment method could not be saved. Please contact <a href="mailto:nathan@taskratchet.com" target={'_blank'} rel="noopener noreferrer">nathan@taskratchet.com</a> for assistance.
                        </Route>

                        <Route path={'/account'}>
                            <Authenticated session={this.state.session} onLogin={this.updateSession}>
                                <Account/>
                            </Authenticated>
                        </Route>

                        <Route path={'/reset'}>
                            <ResetPassword/>
                        </Route>

                        <Route path={'/'}>
                            <Authenticated session={this.state.session} onLogin={this.updateSession}>
                                <Tasks />
                            </Authenticated>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    }
}

export default App;
