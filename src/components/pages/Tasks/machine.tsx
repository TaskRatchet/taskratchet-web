import {assign, createMachine, StateMachine} from "xstate";
import api from "../../../classes/Api";

export interface Context {
    tasks: Task[],
    task: string,
    due: Date,
    cents: number,
    error: string,
    timezone: string,
}

const defaultCents = 500 // TODO: Use user setting

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
            cents: defaultCents,
            error: "",
            timezone: "",
        } as Context,
        states: {
            loading: {
                invoke: {
                    src: "dataService",
                    onDone: {
                        target: "idle",
                        actions: "loadData"
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
                    TOGGLE_TASK: {target: "toggling"}
                }
            },
            saving: {
                invoke: {
                    src: "taskCreationService",
                    onDone: {
                        target: "loading",
                        actions: "resetForm"
                    }
                    // TODO: Handle thrown error
                }
            },
            toggling: {
                invoke: {
                    src: "taskToggleService",
                    onDone: {target: "loading"}
                    // TODO: Handle errors
                }
            }
        },
    }, {
        services: {
            dataService: async () => {
                const tasksResponse = await api.getTasks(),
                    tasks = await tasksResponse.json(),
                    meResponse = await api.getMe(),
                    me = await meResponse.json();

                return {
                    tasks,
                    timezone: me.timezone
                }
            },
            taskCreationService: async (ctx) => {
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
            taskToggleService: async (ctx, e) => {
                const task = ctx.tasks.find(t => t.id === e.value);

                if (!task) {
                    throw Error("No task matching ID")
                }

                const response = await api.setComplete(task.id, !task.complete)

                //     .then((res: any) => {
                //     // res.text().then(console.log)
                //     // toaster.send(res.ok ? `Successfully marked task ${change}`
                //     //     : `Failed to mark task ${change}`);
                //     // refreshData()
                // });

                // TODO: Handle response code
                // TODO: Update message based on success or failure
            }
        },
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
            loadData: assign((ctx, e) => ({
                tasks: e.data.tasks,
                timezone: e.data.timezone
            })),
            setTask: assign({
                task: (ctx, e) => e.value
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
                cents: defaultCents,
            })
        }
    })
}

export default createTasksMachine
