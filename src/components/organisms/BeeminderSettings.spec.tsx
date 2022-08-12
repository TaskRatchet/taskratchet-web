import { RenderResult, waitFor } from '@testing-library/react';
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
import { act } from 'react-test-renderer';
import { vi } from 'vitest';
import { updateMe } from '../../lib/api';
import { getMe } from '../../lib/api';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/LegacyApi');
vi.mock('../../lib/Toaster');

const renderBeeminderSettings = async (): Promise<RenderResult> => {
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

		await renderBeeminderSettings();

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

			const { getByText } = await renderBeeminderSettings();

			await waitFor(() => expect(getMe).toBeCalled());

			userEvent.click(getByText('Save'));

			await waitFor(() => expect(getByText('error')).toBeInTheDocument());
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

			const { getByText } = await renderBeeminderSettings();

			await waitFor(() =>
				expect(getByText('error_message')).toBeInTheDocument()
			);
		});
	});

	it('displays initial load error', async () => {
		await act(async () => {
			await withMutedReactQueryLogger(async () => {
				vi.mocked(getMe).mockImplementation(() => {
					throw new Error('error_message');
				});

				const { getByText } = await renderBeeminderSettings();

				await waitFor(() =>
					expect(getByText('error_message')).toBeInTheDocument()
				);
			});
		});
	});

	it('rejects invalid goal names', async () => {
		loadMeWithBeeminder('the_user', '/');

		const { getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(getByText('Save'));

		expect(updateMe).not.toBeCalled();
	});

	it('allows goal names with hyphens', async () => {
		loadMeWithBeeminder('the_user', 'goal-name');

		const { getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(getByText('Save'));

		await waitFor(() => expect(updateMe).toBeCalled());
	});

	it('displays error message', async () => {
		loadMeWithBeeminder('the_user', '/');

		const { getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(getByText('Save'));

		expect(
			getByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			)
		);
	});

	it('allows unsetting goal name', async () => {
		loadMeWithBeeminder('the_user', '');

		const { getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(getByText('Save'));

		const getError = () =>
			getByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			);

		expect(getError).toThrow();
	});

	it('unsets error on successful save', async () => {
		loadMeWithBeeminder('the_user', '/');

		const { getByText, getByRole } = await renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(getByText('Save'));
		await userEvent.type(getByRole('textbox'), '{backspace}new_name');
		userEvent.click(getByText('Save'));

		const getError = () =>
			getByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			);

		expect(getError).toThrow();
	});

	it('displays error dynamically', async () => {
		loadMeWithBeeminder('the_user', '/');

		const { getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		expect(
			getByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			)
		);
	});

	it('displays loading indicator on save', async () => {
		loadMeWithBeeminder();

		const { container, getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(getMe).toBeCalled());

		userEvent.click(getByText('Save'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});

	// TODO: Add ability to disconnect from Beeminder
});
