import {assign, createMachine, StateMachine} from "xstate";
import api from "../../lib/Api";
import _ from "lodash";
import browser from "../../lib/Browser";

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
                invoke: {
                    src: "connectService",
                    onDone: {
                        target: "idle",
                        actions: "loadData"
                    },
                    onError: {
                        target: "loading"
                        // TODO: toast the error
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
                    onDone: {target: 'idle'}
                    // TODO: onError
                }
            }
        }
    }, {
        services: {
            connectService: async () => {
                const {username, access_token} = browser.getUrlParams()

                if (!_.isString(username) || !_.isString(access_token)) {
                    throw Error('Invalid params for new connection')
                }

                const response = await api.updateMe({
                    beeminder_user: username,
                    beeminder_token: access_token
                })

                return await parseIntegration(response);
            },
            dataService: async () => {
                const response = await api.getMe()

                return parseIntegration(response)
            },
            saveService: async (ctx: Context) => {
                await api.updateMe({
                    beeminder_goal_new_tasks: ctx.bmGoal
                })
            }
        },
        actions: {
            loadData: assign((ctx, e) => ({
                bmUser: _.get(e, 'data.user', ''),
                bmGoal: _.get(e, 'data.goal_new_tasks', '')
            })),
            setGoal: assign({
                bmGoal: (ctx: Partial<Context>, e: any): string => e.value,
            })
        }
    })
}

export default createBeeminderSettingsMachine
