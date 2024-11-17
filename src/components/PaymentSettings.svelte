<script lang="ts">
	import { getCheckoutSession, updateMe } from '@taskratchet/sdk';
	import { redirectToCheckout } from '../react/lib/stripe';
	import { getMe } from '@taskratchet/sdk';
	import { onMount } from 'svelte';

	let hasStripeCustomer = false;
	let loading = false;

	onMount(async () => {
		const me = await getMe();
		hasStripeCustomer = me?.has_stripe_customer || false;
	});
</script>

{#if hasStripeCustomer}
	<a
		href="https://billing.stripe.com/p/login/00g4h79epeQigUw5kk"
		target="_blank"
		rel="noreferrer"
		class="button"
	>
		Manage with Stripe
	</a>
{:else}
	<button
		disabled={loading}
		on:click={() => {
			void (async () => {
				loading = true;
				const { id } = await getCheckoutSession();
				await updateMe({
					checkout_session_id: id,
				});
				await redirectToCheckout(id);
				loading = false;
			})();
		}}
	>
		{loading ? 'Loading...' : 'Add payment method'}
	</button>
{/if}

<style>
	.button, button {
		background: var(--background);
		color: var(--color);
		border: 1px solid var(--color);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		text-decoration: none;
		display: inline-block;
	}

	.button:hover, button:hover:not(:disabled) {
		background: var(--primary);
		border-color: var(--primary);
		color: white;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
