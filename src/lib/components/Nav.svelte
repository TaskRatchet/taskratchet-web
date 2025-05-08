<script lang="ts">
	import { onMount } from 'svelte';
	import { logout } from '@taskratchet/sdk';
	import { user, refreshUser } from '$lib/authStore';

	onMount(() => {
		refreshUser();
	});

	async function handleLogout() {
		try {
			logout();
			await refreshUser();
			window.location.href = '/login';
		} catch (e) {
			console.error('Logout failed:', e);
		}
	}
</script>

<nav class="bg-gray-800 p-4 text-white">
	<div class="container mx-auto flex flex-wrap items-center justify-between">
		<a href="/" class="text-xl font-bold">TaskRatchet</a>
		<div class="space-x-4">
			{#if $user}
				<span class="text-gray-300">{$user.email}</span>
				<button
					on:click={handleLogout}
					class="cursor-pointer border-none bg-transparent p-0 hover:text-gray-300"
				>
					Logout
				</button>
			{:else}
				<a href="/login" class="hover:text-gray-300">Login</a>
			{/if}
		</div>
	</div>
</nav>
