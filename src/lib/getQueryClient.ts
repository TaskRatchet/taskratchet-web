import { QueryClient } from 'react-query';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24,
        },
    },
});

const localStoragePersistor = createWebStoragePersistor({
    storage: window.localStorage,
});

void persistQueryClient({ queryClient, persistor: localStoragePersistor });

export default function getQueryClient() {
    return queryClient;
}