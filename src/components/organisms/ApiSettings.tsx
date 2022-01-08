import React from 'react';
import { useGetApiToken, useMe } from '../../lib/api';
import { LoadingButton } from '@mui/lab';
import {
	Alert,
	AlertTitle,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
} from '@mui/material';

export default function ApiSettings(): JSX.Element {
	const me = useMe();
	const getApiToken = useGetApiToken();

	return (
		<Stack spacing={2} alignItems={'start'}>
			<Alert severity="warning">
				<AlertTitle>Warning</AlertTitle>
				<p>The API is undocumented and likely to change without notice.</p>

				<p>
					Requesting a new token will replace your existing token if you have
					one, meaning you&apos;ll need to replace it wherever you&apos;re using
					it.
				</p>

				<p>We don&apos;t store your token, so save it somewhere safe.</p>
			</Alert>

			<TableContainer component={Paper}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>User ID</TableCell>
							<TableCell>{me.data?.id}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>API Token</TableCell>
							<TableCell>{getApiToken.data || '—'}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>

			<LoadingButton
				loading={getApiToken.isLoading}
				onClick={() => getApiToken.mutate()}
			>
				Request API token
			</LoadingButton>
		</Stack>
	);
}
