import { updateMe } from './updateMe';
import fetch1 from './fetch1';
import set from 'lodash/set';
import { vi, expect, it, describe, beforeEach } from 'vitest';

vi.mock('./fetch1');

describe('updateMe', () => {
	beforeEach(() => {
		vi.mocked(fetch1).mockResolvedValue({ ok: true } as Response);
	});

	it('reformats beeminder integration token', async () => {
		await updateMe({
			beeminder_token: 'the_token',
		});

		const expectedPayload = set(
			{},
			'integrations.beeminder.token',
			'the_token'
		);

		expect(fetch1).toBeCalledWith('me', true, 'PUT', expectedPayload);
	});

	it('reformats beeminder integration user', async () => {
		await updateMe({
			beeminder_user: 'the_user',
		});

		const expectedPayload = set({}, 'integrations.beeminder.user', 'the_user');

		expect(fetch1).toBeCalledWith('me', true, 'PUT', expectedPayload);
	});

	it('reformats beeminder integration goal', async () => {
		await updateMe({
			beeminder_goal_new_tasks: 'the_goal',
		});

		const expectedPayload = set(
			{},
			'integrations.beeminder.goal_new_tasks',
			'the_goal'
		);

		expect(fetch1).toBeCalledWith('me', true, 'PUT', expectedPayload);
	});

	it('pipes remaining fields', async () => {
		const inOut = {
			name: 'the_name',
			email: 'the_email',
			timezone: 'the_timezone',
			checkout_session_id: 'the_session',
		};

		await updateMe(inOut);

		expect(fetch1).toBeCalledWith('me', true, 'PUT', inOut);
	});
});
