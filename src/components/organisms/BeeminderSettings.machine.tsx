import {assign, createMachine, StateMachine} from "xstate";
import api from "../../lib/Api";
import _ from "lodash";
import browser from "../../lib/Browser";
import toaster from "../../lib/Toaster";

interface Context {
    bmUser: string,
    bmGoal: string
}

async function parseIntegration(response: Response) {
    const data = await response.json()

    return _.get(data, 'integrations.beeminder', {})
}

const createBeeminderSettingsMachine = (): StateMachine<Context, any, any> => {
    return createMachine({
        initial: "init",
        context: {
            bmUser: '',
            bmGoal: '',
        },
        states: {
            init: {
                always: [
                    { target: 'connect', cond: 'shouldConnect' },
                    { target: 'loading' }
                ]
            },
            connect: {
                invoke: {
                    src: "connectService",
                    onDone: {
                        target: "idle",
                        actions: "loadData"
                    },
                    onError: {
                        target: "loading",
                        actions: 'toastError'
                    }
                }
            },
            loading: {
                invoke: {
                    src: "dataService",
                    onDone: {
                        target: "idle",
                        actions: "loadData"
                    },
                    onError: {
                        target: "idle",
                        // TODO: actions: "toastError"
                    }
                },
            },
            idle: {
                on: {
                    SAVE: {target: 'saving'},
                    GOAL: {actions: 'setGoal'}
                }
            },
            saving: {
                invoke: {
                    src: 'saveService',
                    onDone: {target: 'idle'},
                    onError: {
                        target: 'idle',
                        actions: 'toastError'
                    }
                }
            }
        }
    }, {
        guards: {
            shouldConnect: () => {
                const {username, access_token} = browser.getUrlParams()

                return !!username
                    && !!access_token
                    && _.isString(username)
                    && _.isString(access_token)
            }
        },
        services: {
            connectService: async () => {
                const {username, access_token} = browser.getUrlParams()

                if (!_.isString(username) || !_.isString(access_token)) {
                    throw new Error('Invalid params for new connection')
                }

                const response = await api.updateMe({
                    beeminder_user: username,
                    beeminder_token: access_token
                })

                if (!response.ok) {
                    const text = await response.text()
                    throw new Error(text)
                }

                return await parseIntegration(response);
            },
            dataService: async () => {
                const response = await api.getMe()

                // TODO: Throw if !response.ok

                return parseIntegration(response)
            },
            saveService: async (ctx: Context) => {
                const response = await api.updateMe({
                    beeminder_goal_new_tasks: ctx.bmGoal
                })

                if (!response.ok) {
                    const text = await response.text()
                    throw new Error(text)
                }
            }
        },
        actions: {
            loadData: assign((ctx, e) => ({
                bmUser: _.get(e, 'data.user', ''),
                bmGoal: _.get(e, 'data.goal_new_tasks', '')
            })),
            setGoal: assign({
                bmGoal: (ctx: Partial<Context>, e: any): string => e.value,
            }),
            toastError: (ctx, e) => {
                toaster.send(e.data.toString())
            }
        }
    })
}

export default createBeeminderSettingsMachine
