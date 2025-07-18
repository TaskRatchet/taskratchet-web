interface Window {
	Stripe: (key: string) => {
		redirectToCheckout: (
			options: unknown,
		) => Promise<{ error: { message: string } }>;
	};
	stripe_key: string;
}
