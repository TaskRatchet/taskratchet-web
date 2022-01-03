import { loadMe } from '../../lib/test/helpers';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import React from 'react';
import GeneralSettings from './GeneralSettings';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/updateMe');

function renderComponent() {
	return render(
		<QueryClientProvider client={new QueryClient()}>
			<GeneralSettings />
		</QueryClientProvider>
	);
}

describe('general settings', () => {
	it('displays loading indicator on save', async () => {
		loadMe({});

		const { container, getByText } = renderComponent();

		userEvent.click(getByText('Save'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});
});
