import { LoadingButton } from '@mui/lab';
import {
	Alert,
	AlertTitle,
	Link,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
} from '@mui/material';

import { useGetApiToken } from '../../lib/api/useGetApiToken';
import { useMe } from '../../lib/api/useMe';

export default function ApiSettings(): JSX.Element {
	const me = useMe();
	const getApiToken = useGetApiToken();

	return (
		<Stack spacing={2} alignItems={'start'}>
			<Alert severity="warning">
				<AlertTitle>Warning</AlertTitle>

				<p>
					Requesting a new token will replace your existing token if you have
					one, meaning you&apos;ll need to replace it wherever you&apos;re using
					it.
				</p>

				<p>We don&apos;t store your token, so save it somewhere safe.</p>

				<Link
					href="https://taskratchet.com/help/api.html"
					target={'_blank'}
					rel="noreferrer"
				>
					Documentation
				</Link>
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
				variant="outlined"
			>
				Request API token
			</LoadingButton>
		</Stack>
	);
}
