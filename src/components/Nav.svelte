<script lang="ts">
	import { onMount } from 'svelte';
	import IconHelp from '~icons/material-symbols/help-outline';
	import IconFeedback from '~icons/material-symbols/feedback-outline';
	import IconLogout from '~icons/material-symbols/logout';
	import IconLight from '~icons/material-symbols/light-mode';
	import IconDark from '~icons/material-symbols/dark-mode';
	import { logout, getSession, getMe, type Session } from '@taskratchet/sdk';

	let session: Session | undefined;
	let email = '';
	let pathname = '';
	let isDark = false;

	onMount(() => {
		isDark = document.documentElement.classList.contains('dark');
		// Set up a mutation observer to watch for class changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'class') {
					isDark = document.documentElement.classList.contains('dark');
				}
			});
		});
		observer.observe(document.documentElement, { attributes: true });
	});

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
		pathname = window.location.pathname;
		isDark = document.documentElement.classList.contains('dark');
	});
</script>

<nav>
	<div>
		<a href="/" class={pathname === '/' ? 'active' : ''}>Next</a>
		<a href="/archive" class={pathname === '/archive' ? 'active' : ''}
			>Archive</a
		>
	</div>

	{#if session}
		<div>
			<a href="/account" class={pathname === '/account' ? 'active' : ''}
				>{email}</a
			>
		</div>
	{/if}

	<div>
		<button
			class="icon-button"
			on:click={() => {
				const isDark = window.matchMedia(
					'(prefers-color-scheme: dark)',
				).matches;
				const override = localStorage.getItem('theme');
				const newTheme =
					override === 'dark' || (!override && isDark) ? 'light' : 'dark';
				localStorage.setItem('theme', newTheme);
				document.documentElement.classList.toggle('dark', newTheme === 'dark');
			}}
			title="Toggle theme"
		>
			{#if isDark}
				<IconLight />
			{:else}
				<IconDark />
			{/if}
		</button>
		<a href="https://taskratchet.com/help" title="Help"><IconHelp /></a>
		<button
			class="link-button"
			on:click={() => {
				window.FreshworksWidget('open');
			}}
			title="Feedback"><IconFeedback /></button
		>
		{#if session}
			<button
				class="link-button"
				on:click={() => {
					logout();
					window.location.href = '/login';
				}}><IconLogout /></button
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
		flex-wrap: wrap;
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
	.link-button {
		background: none;
		border: none;
		color: var(--primary);
		opacity: 0.7;
		cursor: pointer;
		padding: 0;
		font: inherit;
	}

	.link-button:hover {
		opacity: 1;
	}

	.icon-button {
		background: none;
		border: none;
		padding: 0;
		color: var(--color);
		opacity: 0.7;
		cursor: pointer;
	}

	.icon-button:hover {
		opacity: 1;
	}
</style>
