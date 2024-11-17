<script lang="ts">
	import IconHelp from '~icons/material-symbols/help-outline';
	import IconFeedback from '~icons/material-symbols/feedback-outline';
	import IconLogout from '~icons/material-symbols/logout';
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
	<div>
		<a href="/">Next</a>
		<a href="/archive">Archive</a>
	</div>

	{#if session}
		<div>
			<span class="email">{email}</span>
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
	}

	nav a:hover {
		text-decoration: underline;
	}
	.email {
		color: var(--color);
		opacity: 0.7;
	}
</style>
