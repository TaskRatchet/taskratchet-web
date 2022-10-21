import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import React from 'react';
import ApiSettings from './ApiSettings';
import fetch1 from '../../lib/api/fetch1';
import { describe, it, expect, vi } from 'vitest';
import loadControlledPromise from '../../lib/test/loadControlledPromise';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/api/fetch1');

describe('API settings', () => {
	it('displays loading indicator on request click', async () => {
		loadMe({});

		const { resolve } = loadControlledPromise(fetch1);

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
