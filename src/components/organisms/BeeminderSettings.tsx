import React, { FormEvent, useEffect, useState } from 'react';
import { IS_PRODUCTION } from '../../tr_constants';
import { useMe } from '../../lib/api/useMe';
import * as browser from '../../lib/browser';
import { Stack, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useUpdateMe from '../../lib/api/useUpdateMe';
import { User } from '@taskratchet/sdk';

const beeminderClientId: string = IS_PRODUCTION
		? '1w70sy12t1106s9ptod11ex21'
		: '29k46vimhtdeptt616tuhmp2r',
	beeminderRedirect: string = IS_PRODUCTION
		? 'https://app.taskratchet.com/account'
		: 'https://staging.taskratchet.com/account',
	beeminderAuthUrl: string =
		`https://www.beeminder.com/apps/authorize?client_id=${beeminderClientId}` +
		`&redirect_uri=${encodeURIComponent(
			beeminderRedirect,
		)}&response_type=token`;

const BeeminderSettings = (): JSX.Element => {
	const [validationError, setValidationError] = useState<string>('');
	const me = useMe({
		refetchOnWindowFocus: false,
		onSuccess: (data: User) => {
			// TODO: Make sure this doesn't result in field being populated after initial page load
			if (bmGoal) return;
			const goal = data?.integrations?.beeminder?.goal_new_tasks ?? '';
			setBmGoal(goal);
		},
	});
	const { mutate, ...updateMe } = useUpdateMe();
	const bmUser: string = me.data?.integrations?.beeminder?.user || '';
	const [bmGoal, setBmGoal] = useState<string>('');

	useEffect(() => {
		setValidationError(
			/^[-\w]*$/.test(bmGoal)
				? ''
				: 'Goal names can only contain letters, numbers, underscores, and hyphens.',
		);
	}, [bmGoal]);

	useEffect(() => {
		const { username, access_token } = browser.getUrlParams();

		if (typeof username !== 'string' || typeof access_token !== 'string') {
			return;
		}

		mutate({
			beeminder_user: username,
			beeminder_token: access_token,
		});
	}, [mutate]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (validationError) return;

		mutate({
			beeminder_goal_new_tasks: bmGoal,
		});
	};

	return (
		<>
			{me.error instanceof Error && (
				<Alert severity="error">{me.error.message}</Alert>
			)}
			{updateMe.error instanceof Error && (
				<Alert severity="error">{updateMe.error.message}</Alert>
			)}
			{bmUser ? (
				<form onSubmit={handleSubmit}>
					<Stack spacing={2} alignItems={'start'}>
						<p>Beeminder user: {bmUser}</p>

						<TextField
							label={'Post new tasks to goal:'}
							value={bmGoal}
							error={!!validationError}
							helperText={validationError}
							onChange={(e) => {
								setBmGoal(e.target.value);
							}}
						/>

						<LoadingButton loading={updateMe.isLoading} type="submit">
							Save
						</LoadingButton>
					</Stack>
				</form>
			) : (
				<a href={beeminderAuthUrl}>Enable Beeminder integration</a>
			)}
		</>
	);
};

export default BeeminderSettings;
