import fetch1 from './fetch1';
import get from 'lodash/get';
import set from 'lodash/set';

export interface MeInput {
	name?: string | null;
	email?: string | null;
	timezone?: string | null;
	beeminder_token?: string | null;
	beeminder_user?: string | null;
	beeminder_goal_new_tasks?: string | null;
	checkout_session_id?: string | null;
}

const pipe = (
	input: MeInput,
	inputPath: string,
	output: Record<string, unknown>,
	outputPath: string
) => {
	const value: unknown = get(input, inputPath);

	if (value) {
		set(output, outputPath, value);
	}

	return output;
};

const pipeMap = (input: MeInput, pathPairs: string[][]) => {
	return pathPairs.reduce((prev: Record<string, unknown>, pair: string[]) => {
		return pipe(input, pair[0], prev, pair[1]);
	}, {});
};

export async function updateMe(input: MeInput): Promise<Response> {
	const payload = pipeMap(input, [
		['beeminder_token', 'integrations.beeminder.token'],
		['beeminder_user', 'integrations.beeminder.user'],
		['beeminder_goal_new_tasks', 'integrations.beeminder.goal_new_tasks'],
		['email', 'email'],
		['name', 'name'],
		['timezone', 'timezone'],
		['checkout_session_id', 'checkout_session_id'],
	]);

	const response = await fetch1('me', true, 'PUT', payload);

	if (!response.ok) {
		throw new Error('Failed to update me');
	}

	return response;
}
