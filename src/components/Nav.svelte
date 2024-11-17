<script lang="ts">
	import { logout, getSession, getMe } from '@taskratchet/sdk';
	import { onMount } from 'svelte';

	let session = null;
	let email = '';

	onMount(() => {
		session = getSession();
		if (session) {
			email = session.email;
		}

		getMe().then((data) => {
			window.FreshworksWidget('identify', 'ticketForm', {
				name: data?.name,
				email: data?.email,
			});
		});
	});
</script>

<nav>
	<a href="/">Next</a>
	<a href="/archive">Archive</a>
	<a href="https://taskratchet.com/help">Help</a>
	<a
		href="#"
		on:click={() => {
			window.FreshworksWidget('open');
		}}
		rel="noopener">Feedback</a
	>
	{#if session}
		<span class="email">{email}</span>
		<a
			href="#"
			on:click={() => {
				logout();
				window.location.href = '/login';
			}}>Logout</a
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
	.email {
		color: var(--color);
		opacity: 0.7;
	}
</style>
