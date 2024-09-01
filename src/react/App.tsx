import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import RegisterForm from './components/pages/Register';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import Authenticated from './components/pages/Authenticated';
import ResetPassword from './components/pages/ResetPassword';
import 'react-toastify/dist/ReactToastify.css';
import { IS_PRODUCTION } from './tr_constants';
import { QueryClientProvider } from 'react-query';
import NavBar from './components/organisms/NavBar';
import * as browser from './lib/browser';
import { Box, Container, Stack, Alert, Link } from '@mui/material';
import getQueryClient from './lib/getQueryClient';
import Account from './components/pages/Account';
import Tasks from './components/pages/Tasks';
import AndTheme from './components/HOCs/AndTheme';

window.stripe_key = IS_PRODUCTION
	? 'pk_live_inP66DVvlOOA4r3CpaD73dFo00oWsfSpLd'
	: 'pk_test_JNeCMPdZ5zUUb5PV9D1bf9Dz00qqwCo9wp';

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

	// TODO: see if react-router has a way to do this without needing to use a ref
	useEffect(() => {
		if (!ref.current || !('scrollTo' in ref.current)) return;
		ref.current.scrollTo(0, 0);
	}, [location]);

	return (
		<QueryClientProvider client={queryClient}>
			<AndTheme>
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
												<Link
													href="mailto:support@taskratchet.com"
													target={'_blank'}
													rel="noopener noreferrer"
												>
													support@taskratchet.com
												</Link>{' '}
												for assistance.
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
			</AndTheme>
		</QueryClientProvider>
	);
}

export default function AppWithRouter(): JSX.Element {
	return (
		<Router>
			<App />
		</Router>
	);
}
