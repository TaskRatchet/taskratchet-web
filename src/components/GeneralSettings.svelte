<script lang="ts">
	import { updateMe, getMe, getTimezones } from '@taskratchet/sdk';
	import { onMount } from 'svelte';

	let name = '';
	let email = '';
	let timezone = '';
	let timezones: string[] = [];
	let loading = true;
	let error = '';
	let success = '';

	onMount(async () => {
		try {
			const me = await getMe();
			name = me?.name || '';
			email = me?.email || '';
			timezone = me?.timezone || '';
			timezones = await getTimezones();
			loading = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load settings';
			loading = false;
		}
	});

	async function onSubmit(event: Event) {
		event.preventDefault();
		loading = true;
		try {
			await updateMe({ name, email, timezone });
			error = '';
			success = 'Settings updated successfully';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to update settings';
		}
		loading = false;
	}
</script>

{#if loading}
	<div class="loading">Loading settings...</div>
{:else}
	<form on:submit={onSubmit}>
		<div class="stack">
			{#if error}
				<div class="error">{error}</div>
			{/if}
			{#if success}
				<div class="success">{success}</div>
			{/if}

			<label>
				Name
				<input type="text" bind:value={name} />
			</label>

			<label>
				Email
				<input type="email" bind:value={email} />
			</label>

			<label>
				Timezone
				<select bind:value={timezone}>
					{#each timezones as tz}
						<option value={tz}>{tz}</option>
					{/each}
				</select>
			</label>

			<button type="submit" disabled={loading}>
				{loading ? 'Saving...' : 'Save'}
			</button>
		</div>
	</form>
{/if}

<style>
	.loading {
		text-align: center;
		padding: 2rem;
		color: var(--color);
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input,
	select {
		background: var(--background);
		color: var(--color);
		border: 1px solid var(--color);
		padding: 0.5rem;
		padding-right: 2rem;
		border-radius: 4px;
	}

	button {
		align-self: flex-start;
		background: var(--background);
		color: var(--color);
		border: 1px solid var(--color);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		background: var(--primary);
		border-color: var(--primary);
		color: white;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error {
		color: red;
		margin-bottom: 1rem;
	}

	.success {
		color: green;
		margin-bottom: 1rem;
	}
</style>
