import {assign, createMachine, StateMachine} from "xstate";
import api from "../../../classes/Api";

export interface Context {
    tasks: Task[],
    task: string,
    due: Date,
    cents: number,
    error: string,
}

const getDefaultDue = () => {
    const due = new Date();

    due.setDate(due.getDate() + 7);
    due.setHours(23);
    due.setMinutes(59);

    return due;
};

const createTasksMachine = (): StateMachine<Context, any, any> => {
    return createMachine({
        initial: "loading",
        context: {
            tasks: [],
            task: "",
            due: getDefaultDue(),
            cents: 500, // TODO: Use user setting
            error: "",
            // TODO: Add timezone
        } as Context,
        states: {
            loading: {
                invoke: {
                    src: async () => {
                        // TODO: Load user timezone

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
                entry: "validateForm",
                on: {
                    SET_TASK: {actions: "setTask"},
                    SET_DUE: {actions: "setDue"},
                    SET_CENTS: {actions: "setCents"},
                    SAVE_TASK: [
                        {target: "saving", cond: "isFormValid"},
                        {target: "idle"}
                    ],
                }
            },
            saving: {
                invoke: {
                    src: async (ctx) => {
                        const dueString = ctx.due.toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        });

                        const response = await api.addTask(ctx.task, dueString, ctx.cents);

                        // TODO: Throw error if !response.ok
                    },
                    onDone: {
                        target: "loading",
                        actions: "resetForm"
                    }
                    // TODO: Handle thrown error
                }
            }
            // TODO: Add toggling state
        },
    }, {
        guards: {
            isFormValid: (ctx) => !!ctx.task
        },
        actions: {
            validateForm: assign((context, event) => {
                const shouldValidate = event.type === "SAVE_TASK",
                    isTaskMissing = !context.task;

                if (!shouldValidate) return {}

                return {
                    error: isTaskMissing ? 'Task is required' : ''
                }
            }),
            saveTasks: assign({
                tasks: (ctx, e) => e.data
            }),
            setTask: assign({
                task: (ctx, e) =>  e.value
            }),
            setDue: assign({
                due: (ctx, e) => e.value
            }),
            setCents: assign({
                cents: (ctx, e) => e.value
            }),
            resetForm: assign({
                task: "",
                due: getDefaultDue(),
                cents: 500, // TODO: Use user setting
            })
        }
    })
}

export default createTasksMachine
