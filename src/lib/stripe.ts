import { loadStripe } from '@stripe/stripe-js';

export async function redirectToCheckout(sessionId: string): Promise<void> {
	const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

	if (!stripe) {
		throw new Error('Stripe not loaded');
	}

	const result = await stripe.redirectToCheckout({
		sessionId,
	});

	if (result.error) {
		console.log('Checkout redirect error');
		console.log(result);

		throw new Error(result.error.message);
	}
}
