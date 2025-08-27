import { getCheckoutSession } from '@taskratchet/sdk';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGetApiToken } from '../../lib/api/useGetApiToken';
import { loadMe } from '../../lib/test/loadMe';
import { loadTimezones } from '../../lib/test/loadTimezones';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import Settings from './Settings';

vi.mock('../../lib/api/useGetApiToken');

describe('settings page', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		loadMe({});
		vi.mocked(useGetApiToken).mockReturnValue({
			isLoading: false,
			mutate: () => {
				/* noop */
			},
		} as any);
		vi.mocked(getCheckoutSession).mockResolvedValue({
			id: 'session',
		});
	});

	it('includes Beeminder integration settings', async () => {
		loadTimezones();
		loadMe({});

		renderWithQueryProvider(<Settings />);

		expect(
			await screen.findByText('Enable Beeminder integration'),
		).toBeInTheDocument();
	});

	it('loads name', async () => {
		loadMe({
			json: {
				name: 'the_name',
			},
		});

		renderWithQueryProvider(<Settings />);

		await screen.findByDisplayValue('the_name');
	});

	it('loads email', async () => {
		loadMe({
			json: {
				email: 'the_email',
			},
		});

		renderWithQueryProvider(<Settings />);

		await screen.findByDisplayValue('the_email');
	});

	it('loads timezone', async () => {
		loadTimezones(['first', 'America/Indiana/Knox', 'third']);

		loadMe({
			json: {
				timezone: 'America/Indiana/Knox',
			},
		});

		renderWithQueryProvider(<Settings />);

		await screen.findByDisplayValue('America/Indiana/Knox');
	});

	it('has token request button', async () => {
		renderWithQueryProvider(<Settings />);

		await screen.findByText('Request API token');
	});

	it('displays response data', async () => {
		vi.mocked(useGetApiToken).mockReturnValue({
			isLoading: false,
			mutate: () => {
				/* noop */
			},
			data: 'the_token',
		} as any);

		renderWithQueryProvider(<Settings />);

		await userEvent.click(await screen.findByText('Request API token'));

		await screen.findByText('the_token');
	});
});
