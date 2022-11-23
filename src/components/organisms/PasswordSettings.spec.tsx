import React from 'react';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import PasswordSettings from './PasswordSettings';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { vi, expect, it, describe } from 'vitest';
import { updatePassword } from '../../lib/api/updatePassword';
import loadControlledPromise from '../../lib/test/loadControlledPromise';

vi.mock('../../lib/api/updatePassword');

describe('password settings', () => {
	it('requires passwords to match', async () => {
		renderWithQueryProvider(<PasswordSettings />);

		await userEvent.type(await screen.findByLabelText('Old Password *'), 'one');
		await userEvent.type(await screen.findByLabelText('New Password *'), 'two');
		await userEvent.type(
			await screen.findByLabelText('Retype Password *'),
			'three'
		);

		await userEvent.click(await screen.findByText('Save'));

		expect(
			await screen.findByText("Passwords don't match")
		).toBeInTheDocument();
	});

	it('indicates loading state', async () => {
		const { resolve } = loadControlledPromise(updatePassword);

		renderWithQueryProvider(<PasswordSettings />);

		await userEvent.type(await screen.findByLabelText('Old Password *'), 'one');
		await userEvent.type(await screen.findByLabelText('New Password *'), 'two');
		await userEvent.type(
			await screen.findByLabelText('Retype Password *'),
			'two'
		);

		await userEvent.click(await screen.findByText('Save'));

		await screen.findByRole('progressbar');

		resolve();
	});
});
