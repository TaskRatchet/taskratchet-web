import {useQuery} from "react-query";
import {getCheckoutSession} from "./getCheckoutSession";

export function useCheckoutSession() {
    return useQuery('checkoutSession', getCheckoutSession)
}
