import React, {useEffect} from 'react';
import './App.css';
import RegisterForm from './components/pages/Register';
import Tasks from './components/pages/Tasks';
import ReactGA from 'react-ga'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
} from "react-router-dom";
import SessionWidget from './components/molecules/SessionWidget'
import Account from './components/pages/Account'
import Authenticated from './components/pages/Authenticated'
import ResetPassword from "./components/pages/ResetPassword";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {isProduction} from "./tr_constants"
import ManageEmail from "./components/pages/ManageEmail";

toast.configure();

window.stripe_key = isProduction ?
    'pk_live_inP66DVvlOOA4r3CpaD73dFo00oWsfSpLd' :
    'pk_test_JNeCMPdZ5zUUb5PV9D1bf9Dz00qqwCo9wp';

ReactGA.initialize('G-Y074NE79ML');

function usePageViews() {
    let location = useLocation();

    React.useEffect(() => {
        ReactGA.set({page: location.pathname});
        ReactGA.pageview(location.pathname);
    }, [location])
}

const App = () => {
    useEffect(() => {
        document.title = 'TaskRatchet';
    }, []);

    usePageViews()

    return <div className={'page-base'}>
        <SessionWidget />

        <h2><Link to={'/'}>TaskRatchet</Link></h2>

        <div className={'page-base__content'}>
            <Switch>
                <Route path={'/register'}>
                    <RegisterForm />
                </Route>

                <Route path={'/success'}>
                    Your payment method has been saved successfully.
                </Route>

                <Route path={'/cancel'}>
                    Your payment method could not be saved. Please contact
                    <a href="mailto:nathan@taskratchet.com" target={'_blank'}
                       rel="noopener noreferrer">nathan@taskratchet.com</a>
                    for assistance.
                </Route>

                <Route path={'/account'}>
                    <Authenticated>
                        <Account />
                    </Authenticated>
                </Route>

                <Route path={'/reset'}>
                    <ResetPassword />
                </Route>

                <Route path={'/email'}>
                    <ManageEmail />
                </Route>

                <Route path={'/'}>
                    <Authenticated>
                        <Tasks />
                    </Authenticated>
                </Route>
            </Switch>
        </div>
    </div>
}

export default () => <Router><App/></Router>;
