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
} from 'react-router-dom';
import Link, { LinkProps } from '@mui/material/Link';

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

const LinkBehavior = React.forwardRef<
	HTMLAnchorElement,
	Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>(function LinkBehavior(props, ref) {
	const { href, ...other } = props;

	if (props.href.toString().match(/^https?:\/\//)) {
		return <a ref={ref} href={href.toString()} {...other} />;
	}

	return <RouterLink ref={ref} to={href} {...other} />;
});

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
		[prefersDarkMode]
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
