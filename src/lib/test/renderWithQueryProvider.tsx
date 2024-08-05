import { QueryClient, QueryClientProvider } from 'react-query';
import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export function renderWithQueryProvider(
	ui: ReactElement,
): RenderResult & { queryClient: QueryClient } {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const theme = createTheme({
		components: {
			MuiBackdrop: {
				defaultProps: {
					component: React.forwardRef(function C(props, ref: any) {
						return <div {...props} ref={ref} data-testid="mui-backdrop" />;
					}),
				} as any,
			},
		},
	});

	const view = render(
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
		</ThemeProvider>,
	);

	return {
		...view,
		queryClient,
	};
}
