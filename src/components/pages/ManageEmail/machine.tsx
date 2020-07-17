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
    const {t} = options.queryParams
    return createMachine({
        id: 'login',
        initial: 'initial',
        context: {
            subs: {},
        },
        states: {
            initial: {
                invoke: {
                    src: () => api.getSubs(t),
                    onDone: {
                        target: 'idle',
                        actions: assign({
                            subs: (ctx: Context, e) => JSON.parse(e.data)
                        })
                    }
                }
            },
            idle: {},
        },
    })
}

export default createManageEmailMachine