<script lang="ts">
	import { logout } from '@taskratchet/sdk';
</script>

<nav>
	<a href="/">Next</a>
	<a href="/archive">Archive</a>
	<a
		href="#"
		on:click={() => {
			logout();
			window.location.href = '/login';
		}}>Logout</a
	>
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
