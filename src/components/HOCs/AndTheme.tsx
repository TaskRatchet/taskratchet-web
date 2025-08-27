import {
	createTheme,
	CssBaseline,
	ThemeProvider,
	useMediaQuery,
} from '@mui/material';
import type { LinkProps } from '@mui/material/Link';
import React from 'react';
import {
	Link as RouterLink,
	type LinkProps as RouterLinkProps,
	type To,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { COLORS } from '../../constants';

type Props = Omit<RouterLinkProps, 'to'> & { href: To };

const LinkBehavior = React.forwardRef<HTMLAnchorElement, Props>(
	function LinkBehavior(props: Props, ref) {
		const { href, ...other } = props;

		if (typeof href === 'string' && href.match(/^https?:\/\//)) {
			return <a ref={ref} href={href} {...other} />;
		}

		return <RouterLink ref={ref} to={href} {...other} />;
	},
);

export default function AndTheme({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? 'dark' : 'light',
					primary: prefersDarkMode ? COLORS.warm : COLORS.cool,
					secondary: prefersDarkMode ? COLORS.cool : COLORS.warm,
				},
				components: {
					MuiLink: {
						defaultProps: {
							component: LinkBehavior,
						} as LinkProps,
					},
					MuiButtonBase: {
						defaultProps: {
							LinkComponent: LinkBehavior,
						},
					},
				},
			}),
		[prefersDarkMode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
			<ToastContainer theme={prefersDarkMode ? 'dark' : 'light'} />
		</ThemeProvider>
	);
}
