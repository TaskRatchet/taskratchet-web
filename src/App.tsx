import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { Alert, Box, Container, Link, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';

import AndTheme from './components/HOCs/AndTheme';
import NavBar from './components/organisms/NavBar';
import PaymentMethodAlert from './components/organisms/PaymentMethodAlert';
import Authenticated from './components/pages/Authenticated';
import Register from './components/pages/Register';
import ResetPassword from './components/pages/ResetPassword';
import Settings from './components/pages/Settings';
import Tasks from './components/pages/Tasks';
import * as browser from './lib/browser';
import getQueryClient from './lib/getQueryClient';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error('Missing Publishable Key');
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

	// TODO: see if react-router has a way to do this without needing to use a ref
	useEffect(() => {
		if (!ref.current || !('scrollTo' in ref.current)) return;
		ref.current.scrollTo(0, 0);
	}, [location]);

	return (
		<ClerkProvider
			publishableKey={PUBLISHABLE_KEY}
			appearance={{
				theme: browser.prefersDarkMode() ? dark : undefined,
			}}
		>
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
								<PaymentMethodAlert />
								<Routes>
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
														component="a"
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
										path={'/settings'}
										element={
											<Authenticated>
												<Settings />
											</Authenticated>
										}
									/>

									<Route path={'/reset'} element={<ResetPassword />} />

									<Route
										path={'/complete-registration'}
										element={<Register />}
									/>

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
		</ClerkProvider>
	);
}

export default function AppWithRouter(): JSX.Element {
	return (
		<Router>
			<App />
		</Router>
	);
}
