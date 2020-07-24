import {assign, createMachine, StateMachine} from "xstate";
import api from "../../../classes/Api";

export interface Context {
    subs: object
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
                    src: () => api.getSubs(t),
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
                    src: (ctx, e) => {
                        const _list = e.value || list || ''
                        return api.removeSub(_list, t)
                    },
                    onDone: {
                        target: 'idle',
                        actions: 'saveSubs',
                    },
                }
            },
            subscribing: {
                invoke: {
                    src: (ctx, e) => api.addSub(e.value, t),
                    onDone: {
                        target: 'idle',
                        actions: 'saveSubs',
                    }
                }
            },
        },
    }, {
        services: {},
        guards: {
            wasListProvided: (ctx, e) => !!list
        },
        actions: {
            saveSubs: assign({
                subs: (ctx: Context, e) => JSON.parse(e.data)
            })
        }
    })
}

export default createManageEmailMachine