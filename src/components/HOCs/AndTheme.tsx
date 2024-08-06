import {
	ThemeProvider,
	createTheme,
	useMediaQuery,
	CssBaseline,
} from '@mui/material';
import React from 'react';
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
	To,
} from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';
import { ToastContainer } from 'react-toastify';

const colors = {
	warm: {
		lighter: '#ff6427',
		light: '#ff5527',
		main: '#fa4627',
		dark: '#c6371f',
		darker: '#ad301b',
	},
	cool: {
		lighter: '#00e1f0',
		light: '#00bdca',
		main: '#009aa4',
		dark: '#006a71',
		darker: '#005257',
	},
};

type Props = Omit<RouterLinkProps, 'to'> & { href: To };

const LinkBehavior = React.forwardRef<HTMLAnchorElement, Props>(
	function LinkBehavior(props: Props, ref) {
		const { href, ...other } = props;

		if (String(href).match(/^https?:\/\//)) {
			return <a ref={ref} href={String(href)} {...other} />;
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
					primary: prefersDarkMode ? colors.warm : colors.cool,
					secondary: prefersDarkMode ? colors.cool : colors.warm,
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
