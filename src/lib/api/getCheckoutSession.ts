import { apiFetch } from './apiFetch';

export async function getCheckoutSession(): Promise<CheckoutSession> {
	const response = await apiFetch('payments/checkout/session');

	return response.json();
}
