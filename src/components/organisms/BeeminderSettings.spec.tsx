import { RenderResult, waitFor, screen } from '@testing-library/react';
import React from 'react';
import BeeminderSettings from './BeeminderSettings';
import {
	loadMe,
	loadMeWithBeeminder,
	loadUrlParams,
	renderWithQueryProvider,
	withMutedReactQueryLogger,
} from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import { updateMe } from '../../lib/api/updateMe';
import { getMe } from '../../lib/api/getMe';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/LegacyApi');
vi.mock('react-toastify');

const renderBeeminderSettings = (): RenderResult => {
	return renderWithQueryProvider(<BeeminderSettings />);
};

describe('BeeminderSettings component', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		loadMe({});
		loadUrlParams({
			access_token: null,
			username: null,
		});
	});

	it('saves new integration', async () => {
		loadUrlParams({
			access_token: 'the_token',
			username: 'the_user',
		});

		renderBeeminderSettings();

		await waitFor(() =>
			expect(updateMe).toBeCalledWith({
				beeminder_token: 'the_token',
				beeminder_user: 'the_user',
			})
		);
	});

	it('displays save errors', async () => {
		await withMutedReactQueryLogger(async () => {
			loadMeWithBeeminder();

			vi.mocked(updateMe).mockImplementation(() => {
				throw new Error('error');
			});

			renderBeeminderSettings();

			await waitFor(() => expect(getMe).toBeCalled());

			userEvent.click(await screen.findByText('Save'));

			await screen.findByText('error');
		});
	});

	it('displays update error', async () => {
		await withMutedReactQueryLogger(async () => {
			loadUrlParams({
				access_token: 'the_token',
				username: 'the_user',
			});

			vi.mocked(updateMe).mockImplementation(() => {
				throw new Error('error_message');
			});

			renderBeeminderSettings();

			await screen.findByText('error_message');
		});
	});

	it('displays initial load error', async () => {
		await withMutedReactQueryLogger(async () => {
			vi.mocked(getMe).mockImplementation(() => {
				throw new Error('error_message');
			});

			renderBeeminderSettings();

			await screen.findByText('error_message');
		});
	});

	it('rejects invalid goal names', async () => {
		loadMeWithBeeminder('the_user', '/');

		renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(await screen.findByText('Save'));

		expect(updateMe).not.toBeCalled();
	});

	it('allows goal names with hyphens', async () => {
		loadMeWithBeeminder('the_user', 'goal-name');

		renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(await screen.findByText('Save'));

		await waitFor(() => expect(updateMe).toBeCalled());
	});

	it('displays error message', async () => {
		loadMeWithBeeminder('the_user', '/');

		renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(await screen.findByText('Save'));

		expect(
			await screen.findByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			)
		);
	});

	it('allows unsetting goal name', async () => {
		loadMeWithBeeminder('the_user', '');

		renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(await screen.findByText('Save'));

		expect(
			screen.queryByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			)
		).not.toBeInTheDocument();
	});

	it('unsets error on successful save', async () => {
		loadMeWithBeeminder('the_user', '/');

		renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(await screen.findByText('Save'));
		userEvent.type(await screen.findByRole('textbox'), '{backspace}new_name');
		userEvent.click(await screen.findByText('Save'));

		expect(
			screen.queryByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			)
		).not.toBeInTheDocument();
	});

	it('displays error dynamically', async () => {
		loadMeWithBeeminder('the_user', '/');

		renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		expect(
			await screen.findByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			)
		);
	});

	it('displays loading indicator on save', async () => {
		loadMeWithBeeminder();

		renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(await screen.findByText('Save'));

		await screen.findByRole('progressbar');
	});

	// TODO: Add ability to disconnect from Beeminder
});
