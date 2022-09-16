import apiFetch from './fetch1';

export async function getCheckoutSession(): Promise<CheckoutSession> {
	const response = await apiFetch('payments/checkout/session');

	return response.json() as Promise<CheckoutSession>;
}
