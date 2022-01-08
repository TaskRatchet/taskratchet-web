import { RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import BeeminderSettings from './BeeminderSettings';
import * as new_api from '../../lib/api';
import {
	loadMe,
	loadMeWithBeeminder,
	loadUrlParams,
	renderWithQueryProvider,
	withMutedReactQueryLogger,
} from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { act } from 'react-test-renderer';

jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/updateMe');
jest.mock('../../lib/LegacyApi');
jest.mock('../../lib/Toaster');

const renderBeeminderSettings = async (): Promise<RenderResult> => {
	return renderWithQueryProvider(<BeeminderSettings />);
};

describe('BeeminderSettings component', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		loadMe({});
		loadUrlParams({
			access_token: null,
			username: null,
		});
	});

	// it('includes enable link', async () => {
	// 	const { getByText } = await renderBeeminderSettings();
	//
	// 	expect(getByText('Enable Beeminder integration')).toBeDefined();
	// });
	//
	// it('gets me', async () => {
	// 	await renderBeeminderSettings();
	//
	// 	expect(new_api.getMe).toBeCalled();
	// });
	//
	// it('does not include enable link if enabled', async () => {
	// 	loadMeWithBeeminder();
	//
	// 	const { getByText } = await renderBeeminderSettings();
	//
	// 	await waitFor(() => expect(new_api.getMe).toBeCalled());
	//
	// 	expect(() => getByText('Enable Beeminder integration')).toThrow();
	// });
	//
	// it('sets enable link href', async () => {
	// 	const { getByText } = await renderBeeminderSettings();
	// 	const link = getByText('Enable Beeminder integration');
	//
	// 	expect((link as HTMLAnchorElement).href).toContain(
	// 		'https://www.beeminder.com'
	// 	);
	// });
	//
	// it('displays beeminder user', async () => {
	// 	loadMeWithBeeminder();
	//
	// 	const { getByText } = await renderBeeminderSettings();
	//
	// 	await waitFor(() => expect(new_api.getMe).toBeCalled());
	//
	// 	expect(getByText('Beeminder user: bm_user')).toBeDefined();
	// });
	//
	// it('includes new tasks goal input', async () => {
	// 	loadMeWithBeeminder();
	//
	// 	const { getByLabelText } = await renderBeeminderSettings();
	//
	// 	await waitFor(() => expect(new_api.getMe).toBeCalled());
	//
	// 	expect(getByLabelText('Post new tasks to goal:')).toBeDefined();
	// });
	//
	// it('pre-fills goal name', async () => {
	// 	loadMeWithBeeminder();
	//
	// 	const { getByDisplayValue } = await renderBeeminderSettings();
	//
	// 	await waitFor(() => expect(new_api.getMe).toBeCalled());
	//
	// 	expect(getByDisplayValue('bm_goal')).toBeDefined();
	// });
	//
	// it('has save button', async () => {
	// 	loadMeWithBeeminder();
	//
	// 	const { getByText } = await renderBeeminderSettings();
	//
	// 	await waitFor(() => expect(new_api.getMe).toBeCalled());
	//
	// 	expect(getByText('Save')).toBeDefined();
	// });
	//
	// it('updates me', async () => {
	// 	loadMeWithBeeminder();
	//
	// 	const { getByText, getByRole } = await renderBeeminderSettings();
	//
	// 	await waitFor(() => expect(new_api.getMe).toBeCalled());
	//
	// 	await userEvent.type(getByRole('textbox'), 'goal_name');
	// 	userEvent.click(getByText('Save'));
	//
	// 	await waitFor(() => expect(new_api.updateMe).toBeCalled());
	// });
	//
	// it('allows goal name change', async () => {
	// 	loadMeWithBeeminder();
	//
	// 	const { getByDisplayValue } = await renderBeeminderSettings();
	//
	// 	await waitFor(() => expect(new_api.getMe).toBeCalled());
	//
	// 	const input = getByDisplayValue('bm_goal');
	//
	// 	await userEvent.type(input, '_new');
	//
	// 	expect(getByDisplayValue('bm_goal_new')).toBeDefined();
	// });
	//
	// it('saves new goal', async () => {
	// 	loadMeWithBeeminder();
	//
	// 	const { getByDisplayValue, getByText } = await renderBeeminderSettings();
	//
	// 	await waitFor(() => expect(new_api.getMe).toBeCalled());
	//
	// 	const input = getByDisplayValue('bm_goal');
	//
	// 	await userEvent.type(input, '_new');
	//
	// 	userEvent.click(getByText('Save'));
	//
	// 	await waitFor(() =>
	// 		expect(new_api.updateMe).toBeCalledWith({
	// 			beeminder_goal_new_tasks: 'bm_goal_new',
	// 		})
	// 	);
	// });

	it('saves new integration', async () => {
		loadUrlParams({
			access_token: 'the_token',
			username: 'the_user',
		});

		await renderBeeminderSettings();

		await waitFor(() =>
			expect(new_api.updateMe).toBeCalledWith({
				beeminder_token: 'the_token',
				beeminder_user: 'the_user',
			})
		);
	});

	it('displays save errors', async () => {
		await withMutedReactQueryLogger(async () => {
			loadMeWithBeeminder();

			jest.spyOn(new_api, 'updateMe').mockImplementation(() => {
				throw new Error('error');
			});

			const { getByText } = await renderBeeminderSettings();

			await waitFor(() => expect(new_api.getMe).toBeCalled());

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

			jest.spyOn(new_api, 'updateMe').mockImplementation(() => {
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
				jest.spyOn(new_api, 'getMe').mockImplementation(() => {
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

		await waitFor(() => expect(new_api.getMe).toBeCalled());

		userEvent.click(getByText('Save'));

		expect(new_api.updateMe).not.toBeCalled();
	});

	it('allows goal names with hyphens', async () => {
		loadMeWithBeeminder('the_user', 'goal-name');

		const { getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(new_api.getMe).toBeCalled());

		userEvent.click(getByText('Save'));

		await waitFor(() => expect(new_api.updateMe).toBeCalled());
	});

	it('displays error message', async () => {
		loadMeWithBeeminder('the_user', '/');

		const { getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(new_api.getMe).toBeCalled());

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

		await waitFor(() => expect(new_api.getMe).toBeCalled());

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

		await waitFor(() => expect(new_api.getMe).toBeCalled());

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

		await waitFor(() => expect(new_api.getMe).toBeCalled());

		expect(
			getByText(
				'Goal names can only contain letters, numbers, underscores, and hyphens.'
			)
		);
	});

	it('displays loading indicator on save', async () => {
		loadMeWithBeeminder();

		const { container, getByText } = await renderBeeminderSettings();

		await waitFor(() => expect(new_api.getMe).toBeCalled());

		userEvent.click(getByText('Save'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});

	// TODO: Add ability to disconnect from Beeminder
});
