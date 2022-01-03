import React from 'react';
import { renderWithQueryProvider } from '../../lib/test/helpers';
import PasswordSettings from './PasswordSettings';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

jest.mock('../../lib/api/updatePassword');

describe('password settings', () => {
	it('requires passwords to match', async () => {
		const { getByLabelText, getByText } = renderWithQueryProvider(
			<PasswordSettings />
		);

		userEvent.type(getByLabelText('Old Password *'), 'one');
		userEvent.type(getByLabelText('New Password *'), 'two');
		userEvent.type(getByLabelText('Retype Password *'), 'three');

		userEvent.click(getByText('Save'));

		expect(getByText("Passwords don't match")).toBeInTheDocument();
	});

	it('indicates loading state', async () => {
		const { getByLabelText, getByText, container } = renderWithQueryProvider(
			<PasswordSettings />
		);

		userEvent.type(getByLabelText('Old Password *'), 'one');
		userEvent.type(getByLabelText('New Password *'), 'two');
		userEvent.type(getByLabelText('Retype Password *'), 'two');

		userEvent.click(getByText('Save'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});
});
