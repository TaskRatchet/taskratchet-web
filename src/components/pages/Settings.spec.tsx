import { getCheckoutSession } from '@taskratchet/sdk';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useResetApiToken } from '../../lib/api/useResetApiToken';
import { loadMe } from '../../lib/test/loadMe';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import Settings from './Settings';

vi.mock('../../lib/api/useResetApiToken');

describe('settings page', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		loadMe({});
		vi.mocked(useResetApiToken).mockReturnValue({
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
		loadMe({});

		renderWithQueryProvider(<Settings />);

		expect(
			await screen.findByText('Enable Beeminder integration'),
		).toBeInTheDocument();
	});

	it('has token request button', async () => {
		renderWithQueryProvider(<Settings />);

		await screen.findByText('Request API token');
	});

	it('displays response data', async () => {
		const mutate = vi.fn();
		vi.mocked(useResetApiToken).mockReturnValue({
			isLoading: false,
			mutate,
			data: 'the_token',
		} as any);

		renderWithQueryProvider(<Settings />);

		await userEvent.click(await screen.findByText('Request API token'));

		await screen.findByText('the_token');
		expect(mutate).toHaveBeenCalledTimes(1);
	});
});
