import {assign, createMachine, StateMachine} from "xstate";
import api from "../../../lib/Api";
import _ from "lodash";

interface Context {
    bmUser: string,
    bmGoal: string
}

const createBeeminderSettingsMachine = (): StateMachine<Context, any, any> => {
    return createMachine({
        initial: "loading",
        context: {
            bmUser: '',
            bmGoal: '',
        },
        states: {
            loading: {
                invoke: {
                    src: "dataService",
                    onDone: {
                        target: "idle",
                        actions: "loadData"
                    },
                    // onError: {
                    //     target: "idle",
                    //     actions: "toastError"
                    // }
                },
            },
            idle: {}
        }
    }, {
        services: {
            dataService: async () => {
                const response = await api.getMe(),
                    data = await response.json()

                return _.get(data, 'integrations.beeminder', {})
            }
        },
        actions: {
            loadData: assign((ctx, e) => ({
                bmUser: _.get(e, 'data.user', ''),
                bmGoal: _.get(e, 'data.goal', '')
            }))
        }
    })
}

export default createBeeminderSettingsMachine
