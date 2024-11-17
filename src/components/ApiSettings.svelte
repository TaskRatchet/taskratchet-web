<script lang="ts">
	import { getApiToken, getMe } from '@taskratchet/sdk';
	import { onMount } from 'svelte';

	let me: any = null;
	let token = '';
	let loading = false;
	let error = '';
	let success = '';

	onMount(async () => {
		me = await getMe();
	});

	async function requestToken() {
		loading = true;
		try {
			token = await getApiToken();
			error = '';
			success = 'Token generated successfully';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to get token';
		}
		loading = false;
	}
</script>

<div class="stack">
	{#if error}
		<div class="error">{error}</div>
	{/if}
	{#if success}
		<div class="success">{success}</div>
	{/if}

	<div class="alert warning">
		<h3>Warning</h3>

		<p>
			Requesting a new token will replace your existing token if you have one,
			meaning you'll need to replace it wherever you're using it.
		</p>

		<p>We don't store your token, so save it somewhere safe.</p>

		<a
			href="https://taskratchet.com/help/api.html"
			target="_blank"
			rel="noreferrer"
		>
			Documentation
		</a>
	</div>

	<table>
		<tbody>
			<tr>
				<td>User ID</td>
				<td>{me?.id || '—'}</td>
			</tr>
			<tr>
				<td>API Token</td>
				<td>{token || '—'}</td>
			</tr>
		</tbody>
	</table>

	<button on:click={requestToken} disabled={loading}>
		{loading ? 'Loading...' : 'Request API token'}
	</button>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.alert {
		padding: 1rem;
		border-radius: 4px;
		background: #fff3cd;
		color: #856404;
		border: 1px solid #ffeeba;
	}

	.alert h3 {
		margin-top: 0;
	}

	table {
		background: var(--background);
		border: 1px solid var(--color);
		border-radius: 4px;
		border-spacing: 0;
		width: 100%;
	}

	td {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--color);
	}

	tr:last-child td {
		border-bottom: none;
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
