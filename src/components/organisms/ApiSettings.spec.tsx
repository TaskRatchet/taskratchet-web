import { getApiToken } from '@taskratchet/sdk';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import loadControlledPromise from '../../lib/test/loadControlledPromise';
import { loadMe } from '../../lib/test/loadMe';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import ApiSettings from './ApiSettings';

describe('API settings', () => {
	it('displays loading indicator on request click', async () => {
		loadMe({});

		const { resolve } = loadControlledPromise(getApiToken);

		renderWithQueryProvider(<ApiSettings />);

		await userEvent.click(await screen.findByText('Request API token'));

		await screen.findByRole('progressbar');

		resolve();
	});

	it('displays user id', async () => {
		loadMe({ json: { id: 'user_id' } });

		renderWithQueryProvider(<ApiSettings />);

		expect(await screen.findByText('user_id')).toBeInTheDocument();
	});
});
