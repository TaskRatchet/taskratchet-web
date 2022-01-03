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
import NavBar from './components/organisms/NavBar';
import browser from './lib/Browser';
import { DEFAULT_FILTERS } from './components/molecules/FilterButton';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Box, Container, CssBaseline, Stack } from '@mui/material';

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
	const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

	const handleTodayClick = () => {
		setLastToday(browser.getNow());
	};

	useEffect(() => {
		document.title = 'TaskRatchet';
	}, []);

	usePageViews();

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<QueryClientProvider client={queryClient}>
				<CssBaseline />
				<Stack sx={{ height: '100vh' }}>
					<NavBar onTodayClick={handleTodayClick} onFilterChange={setFilters} />
					<Box overflow={'scroll'} flexGrow={1}>
						<Container
							maxWidth={'sm'}
							disableGutters
							sx={{
								height: 1,
							}}
						>
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
