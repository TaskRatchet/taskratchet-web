import {assign, createMachine, StateMachine} from "xstate";
import api from "../../lib/Api";
import toaster from "../../lib/Toaster";
import * as chrono from 'chrono-node'
import browser from "../../lib/Browser";
import _ from 'lodash'

export interface Context {
    tasks: Task[],
    task: string,
    due: Date | null,
    cents: number | null,
    formError: string,
    timezone: string,
}

const createTasksMachine = (): StateMachine<Context, any, any> => {
    return createMachine({
        initial: "loading",
        context: {
            tasks: [],
            task: "",
            due: null,
            cents: null,
            formError: "",
            timezone: "",
        } as Context,
        states: {
            loading: {
                invoke: {
                    src: "dataService",
                    onDone: {
                        target: "idle",
                        actions: "loadData"
                    },
                    onError: {
                        target: "idle",
                        actions: "toastError"
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
                    },
                    onError: {
                        target: "loading",
                        actions: "toastError"
                    }
                }
            },
            toggling: {
                invoke: {
                    src: "taskToggleService",
                    onDone: {target: "loading"},
                    onError: {
                        target: "loading",
                        actions: "toastError"
                    }
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
                if (!ctx.due) {
                    throw Error("No due date")
                }

                if (!ctx.cents) {
                    throw Error("No stakes")
                }

                const dueString = ctx.due.toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                });

                const response = await api.addTask(ctx.task, dueString, ctx.cents);

                toaster.send(response.ok ? 'Task added successfully' :
                    'Failed to add task')
            },
            taskToggleService: async (ctx, e) => {
                const task = ctx.tasks.find(t => t.id === e.value);

                if (!task) {
                    throw Error("No task matching ID")
                }

                const change = task.complete ? "incomplete" : "complete",
                    response = await api.setComplete(task.id, !task.complete);

                toaster.send(response.ok ?
                    `Successfully marked task ${change}` :
                    `Failed to mark task  ${change}`)
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
                    formError: isTaskMissing ? 'Task is required' : ''
                }
            }),
            loadData: assign((ctx, e) => ({
                tasks: e.data.tasks,
                timezone: e.data.timezone
            })),
            setTask: assign({
                task: (ctx, e) => e.value,
                due: (ctx, e) => {
                    const ref = browser.getNow()

                    const response = chrono.parse(
                        e.value,
                        ref,
                        {forwardDate: true}
                    ).pop()

                    if (!response) return null

                    const date = response.date()

                    if (!_.get(response, 'start.knownValues.hour')) {
                        date.setHours(23, 59)
                    }

                    return date
                },
                cents: (ctx, e) => {
                    const matches = e.value.match(/\$(\d+)/)

                    if (!matches) return null

                    return matches.pop() * 100
                }
            }),
            setDue: assign({
                due: (ctx, e) => e.value
            }),
            setCents: assign({
                cents: (ctx, e) => e.value
            }),
            resetForm: assign({
                task: "",
                due: null,
                cents: null,
            } as Context),
            toastError: (ctx, e) => {
                toaster.send(e.data.toString())
            }
        }
    })
}

export default createTasksMachine
