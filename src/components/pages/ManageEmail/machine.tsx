import {assign, createMachine, StateMachine} from "xstate";
import api from "../../../classes/Api";

export interface Context {
    subs: object,
    error: string,
}

interface Options {
    queryParams: {
        t?: string,
        list?: string
    }
}

const createManageEmailMachine = (options: Options = {queryParams: {}}): StateMachine<Context, any, any> => {
    const {t, list} = options.queryParams
    return createMachine({
        id: 'login',
        initial: 'initial',
        context: {
            subs: {},
            error: '',
        },
        states: {
            initial: {
                always: [
                    {target: 'unsubscribing', cond: 'wasListProvided'},
                    {target: 'loading'},
                ]
            },
            loading: {
                invoke: {
                    src: async () => await (await api.getSubs(t)).json(),
                    onDone: {
                        target: 'idle',
                        actions: 'saveSubs'
                    }
                }
            },
            idle: {
                on: {
                    UNSUBSCRIBE: 'unsubscribing',
                    SUBSCRIBE: 'subscribing',
                },
            },
            unsubscribing: {
                invoke: {
                    src: async (ctx, e) => {
                        const _list = e.value || list || '',
                            response = await api.removeSub(_list, t)

                        if (!response.ok) {
                            throw new Error('Unsubscribe failed')
                        }

                        return await response.json()
                    },
                    onDone: {
                        target: 'idle',
                        actions: 'saveSubs',
                    },
                    onError: {
                        target: 'idle',
                        actions: 'setError'
                    },
                }
            },
            subscribing: {
                invoke: {
                    src: async (ctx, e) => {
                        const response = await api.addSub(e.value, t);

                        if (!response.ok) {
                            throw new Error('Subscribe failed')
                        }

                        return await response.json()
                    },
                    onDone: {
                        target: 'idle',
                        actions: 'saveSubs',
                    },
                    onError: {
                        target: 'idle',
                        actions: 'setError'
                    },
                }
            },
        },
    }, {
        services: {},
        guards: {
            wasListProvided: (ctx, e) => !!list,
            wasRequestSuccessful: (ctx, e) => !!e.data.ok,
        },
        actions: {
            saveSubs: assign({
                subs: (ctx, e) => e.data
            }),
            setError: assign({
                error: (ctx, e) => e.data.message
            })
        }
    })
}

export default createManageEmailMachine