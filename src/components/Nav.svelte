<script lang="ts">
	import { onMount } from 'svelte';
	import IconHelp from '~icons/material-symbols/help-outline';
	import IconFeedback from '~icons/material-symbols/feedback-outline';
	import IconLogout from '~icons/material-symbols/logout';
	import { logout, getSession, getMe } from '@taskratchet/sdk';

	let session = null;
	let email = '';
	let pathname = '';

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
		pathname = window.location.pathname;
		});


	});
</script>

<nav>
	<div>
		<a href="/" class={pathname === '/' ? 'active' : ''}>Next</a>
		<a href="/archive" class={pathname === '/archive' ? 'active' : ''}>Archive</a>
	</div>

	{#if session}
		<div>
			<a href="/account" class={pathname === '/account' ? 'active' : ''}>{email}</a>
		</div>
	{/if}

	<div>
		<a href="https://taskratchet.com/help" title="Help"><IconHelp /></a>
		<a
			href="#"
			on:click={() => {
				window.FreshworksWidget('open');
			}}
			rel="noopener"
			title="Feedback"><IconFeedback /></a
		>
		{#if session}
			<a
				href="#"
				on:click={() => {
					logout();
					window.location.href = '/login';
				}}><IconLogout /></a
			>
		{/if}
	</div>
</nav>

<style>
	nav {
		padding: 1rem;
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
	}

	nav div {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	nav a {
		text-decoration: none;
		opacity: 0.7;
	}

	nav a:hover {
		text-decoration: underline;
		opacity: 1;
	}

	nav a.active {
		opacity: 1;
		color: var(--primary);
	}
	.email {
		color: var(--color);
		opacity: 0.7;
	}
</style>
