<script lang="ts">
	import { getMe, updateMe } from '@taskratchet/sdk';
	import { onMount } from 'svelte';
	const beeminderAuthUrl =
		`https://www.beeminder.com/apps/authorize?client_id=${import.meta.env.PUBLIC_BEEMINDER_CLIENT_ID}` +
		`&redirect_uri=${encodeURIComponent(import.meta.env.PUBLIC_BEEMINDER_REDIRECT_URI)}&response_type=token`;

	let bmUser = '';
	let bmGoal = '';
	let error = '';

	onMount(async () => {
		const me = await getMe();
		bmUser = me?.integrations?.beeminder?.user || '';
		bmGoal = me?.integrations?.beeminder?.goal_new_tasks || '';
	});

	async function onSubmit(event: Event) {
		event.preventDefault();
		if (!/^[-\w]*$/.test(bmGoal)) {
			error = 'Goal names can only contain letters, numbers, underscores, and hyphens.';
			return;
		}
		try {
			await updateMe({
				beeminder_goal_new_tasks: bmGoal,
			});
			error = '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to update settings';
		}
	}
</script>

{#if error}
	<div class="error">{error}</div>
{/if}

{#if bmUser}
	<form on:submit={onSubmit}>
		<p>Beeminder user: {bmUser}</p>

		<label>
			Post new tasks to goal:
			<input type="text" bind:value={bmGoal} />
		</label>

		<button type="submit">Save</button>
	</form>
{:else}
	<a href={beeminderAuthUrl} class="button">Enable Beeminder integration</a>
{/if}

<style>
	.error {
		color: red;
		margin-bottom: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input {
		background: var(--background);
		color: var(--color);
		border: 1px solid var(--color);
		padding: 0.5rem;
		border-radius: 4px;
	}

	button, .button {
		align-self: flex-start;
		background: var(--background);
		color: var(--color);
		border: 1px solid var(--color);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		text-decoration: none;
	}

	button:hover, .button:hover {
		background: var(--primary);
		border-color: var(--primary);
		color: white;
	}
</style>
