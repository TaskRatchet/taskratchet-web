import { updateMe } from '@taskratchet/sdk';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import loadControlledPromise from '../../lib/test/loadControlledPromise';
import { loadMe } from '../../lib/test/loadMe';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import GeneralSettings from './GeneralSettings';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');

describe('general settings', () => {
	it('displays loading indicator on save', async () => {
		loadMe();

		const { resolve } = loadControlledPromise(updateMe);

		renderWithQueryProvider(<GeneralSettings />);

		await userEvent.click(screen.getByText('Save'));

		expect(await screen.findByRole('progressbar')).toBeInTheDocument();

		resolve();
	});
});
