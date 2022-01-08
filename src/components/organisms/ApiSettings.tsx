import React from 'react';
import { useGetApiToken } from '../../lib/api';
import { LoadingButton } from '@mui/lab';

export default function ApiSettings(): JSX.Element {
	const { mutate, isLoading, data } = useGetApiToken();

	return (
		<>
			<p>
				Warning: The API is undocumented and likely to change without notice.
			</p>

			<p>
				Requesting a new token will replace your existing token if you have one,
				meaning you&apos;ll need to replace it wherever you&apos;re using it.
			</p>

			<p>We don&apos;t store your token, so save it somewhere safe.</p>

			<LoadingButton loading={isLoading} onClick={() => mutate()}>
				Request API token
			</LoadingButton>

			{data && <p>{data}</p>}
		</>
	);
}
