import { loadMe } from '../../lib/test/loadMe';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import React from 'react';
import ApiSettings from './ApiSettings';
import { describe, it, expect } from 'vitest';
import loadControlledPromise from '../../lib/test/loadControlledPromise';
import { getApiToken } from '@taskratchet/sdk';

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
