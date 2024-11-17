<script lang="ts">
	import { logout, getSession } from '@taskratchet/sdk';
	import { onMount } from 'svelte';

	let session = null;

	onMount(() => {
		session = getSession();
	});
</script>

<nav>
	<a href="/">Next</a>
	<a href="/archive">Archive</a>	{#if session}
		<a
			href="#"
			on:click={() => { logout(); window.location.href = '/login'; }}
			>Logout</a
		>
	{/if}
</nav>

<style>
	nav {
		padding: 1rem;
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	nav a {
		text-decoration: none;
	}

	nav a:hover {
		text-decoration: underline;
	}
</style>
