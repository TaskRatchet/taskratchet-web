import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, type RenderResult } from '@testing-library/react';
import React, { type ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export function TestWrapper({ children }: { children: React.ReactNode }) {
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

	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ThemeProvider>
	);
}

export function renderWithQueryProvider(ui: ReactElement): RenderResult {
	return render(<TestWrapper>{ui}</TestWrapper>);
}
