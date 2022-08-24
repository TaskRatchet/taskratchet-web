import { updateMe } from './updateMe';
import { apiFetch } from './apiFetch';
import _ from 'lodash';
import { vi, expect, it, describe, beforeEach } from 'vitest';

vi.mock('./apiFetch');

describe('updateMe', () => {
	beforeEach(() => {
		vi.mocked(apiFetch).mockResolvedValue({ ok: true } as Response);
	});

	it('reformats beeminder integration token', async () => {
		await updateMe({
			beeminder_token: 'the_token',
		});

		const expectedPayload = _.set(
			{},
			'integrations.beeminder.token',
			'the_token'
		);

		expect(apiFetch).toBeCalledWith('me', true, 'PUT', expectedPayload);
	});

	it('reformats beeminder integration user', async () => {
		await updateMe({
			beeminder_user: 'the_user',
		});

		const expectedPayload = _.set(
			{},
			'integrations.beeminder.user',
			'the_user'
		);

		expect(apiFetch).toBeCalledWith('me', true, 'PUT', expectedPayload);
	});

	it('reformats beeminder integration goal', async () => {
		await updateMe({
			beeminder_goal_new_tasks: 'the_goal',
		});

		const expectedPayload = _.set(
			{},
			'integrations.beeminder.goal_new_tasks',
			'the_goal'
		);

		expect(apiFetch).toBeCalledWith('me', true, 'PUT', expectedPayload);
	});

	it('pipes remaining fields', async () => {
		const inOut = {
			name: 'the_name',
			email: 'the_email',
			timezone: 'the_timezone',
			checkout_session_id: 'the_session',
		};

		await updateMe(inOut);

		expect(apiFetch).toBeCalledWith('me', true, 'PUT', inOut);
	});
});
