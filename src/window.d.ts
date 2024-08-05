interface Window {
	FreshworksWidget: (...props: unknown[]) => void;
	Stripe: (key: string) => {
		redirectToCheckout: (
			options: unknown,
		) => Promise<{ error: { message: string } }>;
	};
	stripe_key: string;
}
