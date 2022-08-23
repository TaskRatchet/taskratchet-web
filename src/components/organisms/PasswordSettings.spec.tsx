import React from 'react';
import { renderWithQueryProvider } from '../../lib/test/helpers';
import PasswordSettings from './PasswordSettings';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../../lib/api/updatePassword');

describe('password settings', () => {
	it('requires passwords to match', async () => {
		renderWithQueryProvider(<PasswordSettings />);

		userEvent.type(await screen.findByLabelText('Old Password *'), 'one');
		userEvent.type(await screen.findByLabelText('New Password *'), 'two');
		userEvent.type(await screen.findByLabelText('Retype Password *'), 'three');

		userEvent.click(await screen.findByText('Save'));

		await screen.findByText("Passwords don't match");
	});

	it('indicates loading state', async () => {
		const { container } = renderWithQueryProvider(<PasswordSettings />);

		userEvent.type(await screen.findByLabelText('Old Password *'), 'one');
		userEvent.type(await screen.findByLabelText('New Password *'), 'two');
		userEvent.type(await screen.findByLabelText('Retype Password *'), 'two');

		userEvent.click(await screen.findByText('Save'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});
});
