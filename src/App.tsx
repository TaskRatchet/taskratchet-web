import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import RegisterForm from './components/pages/Register';
import Tasks from './components/pages/Tasks';
import ReactGA from 'react-ga4';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import Account from './components/pages/Account';
import Authenticated from './components/pages/Authenticated';
import ResetPassword from './components/pages/ResetPassword';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IS_PRODUCTION } from './tr_constants';
import { QueryClientProvider } from 'react-query';
import NavBar from './components/organisms/NavBar';
import browser from './lib/Browser';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Container, CssBaseline, Stack, Alert } from '@mui/material';
import { H } from 'highlight.run';
import getQueryClient from './lib/getQueryClient';
import { ErrorBoundary } from '@highlight-run/react';

toast.configure();

H.init('qe9174g1', {
	environment: process.env.NODE_ENV,
});

window.stripe_key = IS_PRODUCTION
	? 'pk_live_inP66DVvlOOA4r3CpaD73dFo00oWsfSpLd'
	: 'pk_test_JNeCMPdZ5zUUb5PV9D1bf9Dz00qqwCo9wp';

ReactGA.initialize('G-Y074NE79ML', {
	gtagOptions: {
		debug_mode: !IS_PRODUCTION,
	},
});

function usePageViews(): void {
	const location = useLocation();

	console.log('location', location);

	React.useEffect(() => {
		ReactGA.set({ page: location.pathname });
		ReactGA.pageview(location.pathname);
	}, [location]);
}

export function App(): JSX.Element {
	const [lastToday, setLastToday] = useState<Date>();
	const ref = useRef<HTMLElement>();
	const location = useLocation();
	const queryClient = getQueryClient();

	const handleTodayClick = () => {
		setLastToday(browser.getNowDate());
	};

	useEffect(() => {
		document.title = 'TaskRatchet';
	}, []);

	useEffect(() => {
		if (!ref.current || !('scrollTo' in ref.current)) return;
		ref.current.scrollTo(0, 0);
	}, [location]);

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
					<NavBar onTodayClick={handleTodayClick} />
					<Box ref={ref} overflow={'scroll'} flexGrow={1}>
						<Container
							maxWidth={'sm'}
							disableGutters
							sx={{
								minHeight: 1,
							}}
						>
							<Routes>
								<Route path={'/register'} element={<RegisterForm />} />

								<Route
									path={'/success'}
									element={
										<Box sx={{ p: 2 }}>
											<Alert severity="success">
												Your payment method has been saved successfully.
											</Alert>
										</Box>
									}
								/>

								<Route
									path={'/cancel'}
									element={
										<Box sx={{ p: 2 }}>
											<Alert severity="error">
												Your payment method could not be saved. Please contact{' '}
												{email} for assistance.
											</Alert>
										</Box>
									}
								/>

								<Route
									path={'/account'}
									element={
										<Authenticated>
											<Account />
										</Authenticated>
									}
								/>

								<Route path={'/reset'} element={<ResetPassword />} />

								<Route
									path={'/'}
									element={
										<Authenticated>
											<Tasks lastToday={lastToday} />
										</Authenticated>
									}
								/>
							</Routes>
						</Container>
					</Box>
				</Stack>
			</QueryClientProvider>
		</LocalizationProvider>
	);
}

export default function AppWithRouter(): JSX.Element {
	return (
		<React.StrictMode>
			<ErrorBoundary>
				<Router>
					<App />
				</Router>
			</ErrorBoundary>
		</React.StrictMode>
	);
}
