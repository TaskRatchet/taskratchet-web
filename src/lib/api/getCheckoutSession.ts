import { fetch1 } from './fetch1';

export async function getCheckoutSession(): Promise<CheckoutSession> {
	const response = await fetch1('payments/checkout/session');

	return response.json() as Promise<CheckoutSession>;
}
