import React, { useEffect, useState } from 'react';
import './App.css';
import RegisterForm from './components/pages/Register';
import Tasks from './components/pages/Tasks';
import ReactGA from 'react-ga';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useLocation,
} from 'react-router-dom';
import Account from './components/pages/Account';
import Authenticated from './components/pages/Authenticated';
import ResetPassword from './components/pages/ResetPassword';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isProduction } from './tr_constants';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoadingIndicator from './components/molecules/LoadingIndicator';
import NavBar from './components/organisms/NavBar';
import browser from './lib/Browser';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

toast.configure();

window.stripe_key = isProduction
	? 'pk_live_inP66DVvlOOA4r3CpaD73dFo00oWsfSpLd'
	: 'pk_test_JNeCMPdZ5zUUb5PV9D1bf9Dz00qqwCo9wp';

ReactGA.initialize('G-Y074NE79ML');

const queryClient = new QueryClient();

function usePageViews(): void {
	const location = useLocation();

	React.useEffect(() => {
		ReactGA.set({ page: location.pathname });
		ReactGA.pageview(location.pathname);
	}, [location]);
}

// TODO: Turn on typescript strict mode

export function App(): JSX.Element {
	const [lastToday, setLastToday] = useState<Date>();
	const handleTodayClick = () => {
		setLastToday(browser.getNow());
	};

	useEffect(() => {
		document.title = 'TaskRatchet';
	}, []);

	usePageViews();

	return (
		<div className={'page-base'}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<QueryClientProvider client={queryClient}>
					<NavBar onTodayClick={handleTodayClick} />

					<LoadingIndicator />

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
								<a
									href="mailto:nathan@taskratchet.com"
									target={'_blank'}
									rel="noopener noreferrer"
								>
									nathan@taskratchet.com
								</a>
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

							<Route path={'/'}>
								<Authenticated>
									<Tasks lastToday={lastToday} />
								</Authenticated>
							</Route>
						</Switch>
					</div>
				</QueryClientProvider>
			</MuiPickersUtilsProvider>
		</div>
	);
}

export default function AppWithRouter(): JSX.Element {
	return (
		<Router>
			<App />
		</Router>
	);
}
