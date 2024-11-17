<script lang="ts">
	import { updatePassword } from '@taskratchet/sdk';

	let oldPassword = '';
	let password = '';
	let password2 = '';
	let shouldShowMismatch = false;
	let loading = false;
	let error = '';

	const savePassword = async (event: Event) => {
		event.preventDefault();

		if (!isPasswordFormValid()) return;

		loading = true;
		try {
			await updatePassword(oldPassword, password);
			error = '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to update password';
		}
		loading = false;
	};

	const isPasswordFormValid = () => {
		shouldShowMismatch = true;
		return password === password2;
	};
</script>

<form on:submit={savePassword}>
	<div class="stack">
		{#if error}
			<div class="error">{error}</div>
		{/if}

		<label>
			Old Password
			<input
				type="password"
				bind:value={oldPassword}
				required
			/>
		</label>

		<label>
			New Password
			<input
				type="password"
				bind:value={password}
				required
				class:error={shouldShowMismatch && password !== password2}
			/>
		</label>

		<label>
			Retype Password
			<input
				type="password"
				bind:value={password2}
				required
				class:error={shouldShowMismatch && password !== password2}
			/>
			{#if shouldShowMismatch && password !== password2}
				<div class="error-text">Passwords don't match</div>
			{/if}
		</label>

		<button type="submit" disabled={loading}>
			{loading ? 'Saving...' : 'Save'}
		</button>
	</div>
</form>

<style>
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

	input {
		background: var(--background);
		color: var(--color);
		border: 1px solid var(--color);
		padding: 0.5rem;
		border-radius: 4px;
	}

	input.error {
		border-color: red;
	}

	.error {
		color: red;
		margin-bottom: 1rem;
	}

	.error-text {
		color: red;
		font-size: 0.875rem;
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
</style>
