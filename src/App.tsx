import React, {useEffect, useState} from 'react';
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
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from "./classes/Api";
import {isProduction} from "./tr_constants"

toast.configure();

window.stripe_key = isProduction ?
    'pk_live_inP66DVvlOOA4r3CpaD73dFo00oWsfSpLd' :
    'pk_test_JNeCMPdZ5zUUb5PV9D1bf9Dz00qqwCo9wp';

const cookies = new Cookies();

ReactGA.initialize('G-Y074NE79ML');

const history = createHistory();
history.listen(location => {
    ReactGA.set({page: location.pathname});
    ReactGA.pageview(location.pathname);
});

interface AppProps {}

const App = (props: AppProps) => {
    const [session, setSession] = useState<Session | null>(null);

    const logOut = () => {
        cookies.remove('tr_session');
        updateSession();
    };

    const api: Api = new Api(logOut);

    useEffect(() => {
        document.title = 'TaskRatchet';

        updateSession();

        ReactGA.pageview(window.location.pathname);
    }, []);

    const updateSession = () => {
        setSession(cookies.get('tr_session'));
    };

    return <div className={'page-base'}>
        <Router history={history}>
            <SessionWidget session={session} logOutHandler={logOut}/>

            <h2><Link to={'/'}>TaskRatchet</Link></h2>

            <div className={'page-base__content'}>
                <Switch>
                    <Route path={'/register'}>
                        <RegisterForm api={api} />
                    </Route>

                    <Route path={'/success'}>
                        Your payment method has been saved successfully.
                    </Route>

                    <Route path={'/cancel'}>
                        Your payment method could not be saved. Please contact
                        <a href="mailto:nathan@taskratchet.com" target={'_blank'} rel="noopener noreferrer">nathan@taskratchet.com</a>
                        for assistance.
                    </Route>

                    <Route path={'/account'}>
                        <Authenticated api={api} session={session} onLogin={updateSession}>
                            <Account api={api} />
                        </Authenticated>
                    </Route>

                    <Route path={'/reset'}>
                        <ResetPassword api={api} />
                    </Route>

                    <Route path={'/'}>
                        <Authenticated api={api} session={session} onLogin={updateSession}>
                            <Tasks api={api} />
                        </Authenticated>
                    </Route>
                </Switch>
            </div>
        </Router>
    </div>
}

export default App;
