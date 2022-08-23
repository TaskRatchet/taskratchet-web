import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';
import React from 'react';
import GeneralSettings from './GeneralSettings';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');

describe('general settings', () => {
	it('displays loading indicator on save', async () => {
		loadMe();

		renderWithQueryProvider(<GeneralSettings />);

		userEvent.click(screen.getByText('Save'));

		await screen.findByRole('progressbar');
	});
});
