import {QueryClient} from "react-query"

export function getUnloadMessage(client: QueryClient) {
    const cache = client.getMutationCache()
    const mutations = cache.getAll()
    const statuses = mutations.map((m) => m.state.status)
    const pendingMutations = statuses.includes('loading');

    if (pendingMutations) {
        return "There are changes that may be lost if you continue exiting."
    }
}
