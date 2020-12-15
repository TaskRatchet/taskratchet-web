import {apiFetch} from "./apiFetch";

export async function getCheckoutSession() {
    const response = await apiFetch('payments/checkout/session')

    return response.json()
}
