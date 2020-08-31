import {assign, createMachine, StateMachine} from "xstate";
import api from "../../../classes/Api";

export interface Context {
    tasks: Task[],
    task: string,
    due: number,
    stakes: number,
}

const createTasksMachine = (): StateMachine<Context, any, any> => {
    return createMachine({
        initial: "loading",
        context: {
            tasks: [],
            task: "",
            due: 0, // TODO: Set to +1 week at midnight
            stakes: 5, // TODO: Use user setting
        } as Context,
        states: {
            loading: {
                invoke: {
                    src: async () => {
                        const response = await api.getTasks();

                        return await response.json()
                    },
                    onDone: {
                        target: "idle",
                        actions: "saveTasks"
                    }
                },
            },
            idle: {
                on: {
                    SET_TASK: {actions: "setTask"},
                    SET_DUE: {actions: "setDue"},
                    SET_STAKES: {actions: "setStakes"},
                    SAVE_TASK: [
                        {target: "saving", cond: "isFormValid"},
                        {target: "idle"}
                    ],
                }
            },
            saving: {
                always: {target: "loading"}
            }
        },
    }, {
        guards: {
            isFormValid: (ctx) => true // TODO: Implement guard
        },
        actions: {
            saveTasks: assign({
                tasks: (ctx, e) => e.data
            }),
            setTask: assign({
                task: (ctx, e) => e.value
            }),
            setDue: assign({
                due: (ctx, e) => e.value
            }),
            setStakes: assign({
                stakes: (ctx, e) => e.value
            }),
        }
    })
}

export default createTasksMachine
