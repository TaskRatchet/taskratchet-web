import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';
import React from 'react';
import GeneralSettings from './GeneralSettings';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/updateMe');

describe('general settings', () => {
	it('displays loading indicator on save', async () => {
		loadMe({});

		const { container, getByText } = renderWithQueryProvider(
			<GeneralSettings />
		);

		userEvent.click(getByText('Save'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});
});
