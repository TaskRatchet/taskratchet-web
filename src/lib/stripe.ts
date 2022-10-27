export async function redirectToCheckout(sessionId: string): Promise<void> {
	const stripe = window.Stripe(window.stripe_key);

	const result = await stripe.redirectToCheckout({
		sessionId,
	});

	if (result.error) {
		console.log('Checkout redirect error');
		console.log(result);

		throw new Error(result.error.message);
	}
}
