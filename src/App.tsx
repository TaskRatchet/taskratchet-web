import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import RegisterForm from './components/pages/Register';
import Tasks from './components/pages/Tasks';
import ReactGA from 'react-ga';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useLocation,
	useHistory,
} from 'react-router-dom';
import Account from './components/pages/Account';
import Authenticated from './components/pages/Authenticated';
import ResetPassword from './components/pages/ResetPassword';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isProduction } from './tr_constants';
import { QueryClient, QueryClientProvider } from 'react-query';
import NavBar from './components/organisms/NavBar';
import browser from './lib/Browser';
import { DEFAULT_FILTERS } from './components/molecules/FilterButton';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Box, Container, CssBaseline, Stack, Alert } from '@mui/material';
import { H } from 'highlight.run';

toast.configure();

H.init('qe9174g1', {
	environment: process.env.NODE_ENV,
});

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
	const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
	const ref = useRef<HTMLElement>();
	const history = useHistory();

	const handleTodayClick = () => {
		setLastToday(browser.getNowDate());
	};

	useEffect(() => {
		document.title = 'TaskRatchet';
	}, []);

	useEffect(() => {
		const unlisten = history.listen(() => {
			if (!ref.current || !('scrollTo' in ref.current)) return;
			ref.current.scrollTo(0, 0);
		});
		return () => {
			unlisten();
		};
	}, [history]);

	usePageViews();

	const email = (
		<a
			href="mailto:nathan@taskratchet.com"
			target={'_blank'}
			rel="noopener noreferrer"
		>
			nathan@taskratchet.com
		</a>
	);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<QueryClientProvider client={queryClient}>
				<CssBaseline />
				<Stack sx={{ height: '100vh' }}>
					<NavBar onTodayClick={handleTodayClick} onFilterChange={setFilters} />
					<Box ref={ref} overflow={'scroll'} flexGrow={1}>
						<Container
							maxWidth={'sm'}
							disableGutters
							sx={{
								minHeight: 1,
							}}
						>
							<Switch>
								<Route path={'/register'}>
									<RegisterForm />
								</Route>

								<Route path={'/success'}>
									<Box sx={{ p: 2 }}>
										<Alert severity="success">
											Your payment method has been saved successfully.
										</Alert>
									</Box>
								</Route>

								<Route path={'/cancel'}>
									<Box sx={{ p: 2 }}>
										<Alert severity="error">
											Your payment method could not be saved. Please contact{' '}
											{email} for assistance.
										</Alert>
									</Box>
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
										<Tasks lastToday={lastToday} filters={filters} />
									</Authenticated>
								</Route>
							</Switch>
						</Container>
					</Box>
				</Stack>
			</QueryClientProvider>
		</LocalizationProvider>
	);
}

export default function AppWithRouter(): JSX.Element {
	return (
		<Router>
			<App />
		</Router>
	);
}
