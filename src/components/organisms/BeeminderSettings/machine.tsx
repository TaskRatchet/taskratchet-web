import {createMachine, StateMachine} from "xstate";
import {Context} from "../../pages/Tasks/machine";
import api from "../../../classes/Api";

const createBeeminderSettingsMachine = (): StateMachine<Context, any, any> => {
    return createMachine({
        initial: "loading",
        states: {
            loading: {
                invoke: {
                    src: "dataService",
                    // onDone: {
                    //     target: "idle",
                    //     actions: "loadData"
                    // },
                    // onError: {
                    //     target: "idle",
                    //     actions: "toastError"
                    // }
                },
            }
        }
    }, {
        services: {
            dataService: async () => {
                await api.getMe()
            }
        }
    })
}

export default createBeeminderSettingsMachine
