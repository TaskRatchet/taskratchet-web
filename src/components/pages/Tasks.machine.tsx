import {assign, createMachine, StateMachine} from "xstate";
import api from "../../lib/LegacyApi";
import toaster from "../../lib/Toaster";
import React from 'react';
import {addTask} from "../../lib/api/addTask";

export interface Context {
    tasks: Task[],
    task: string,
    taskHighlighted: JSX.Element | null,
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
            taskHighlighted: null,
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
                    SET_FORM: {actions: "setForm"},
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
                // TODO: Replace logic with hooks

                // const tasksResponse = await api.getTasks(),
                //     tasks = await tasksResponse.json(),
                //     meResponse = await api.getMe(),
                //     me = await meResponse.json();
                //
                // return {
                //     tasks,
                //     timezone: me.timezone
                // }

                return {
                    tasks: [],
                    timezone: 'the_timezone'
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

                const response = await addTask(ctx.task, dueString, ctx.cents);

                toaster.send(response.ok ? 'Task added successfully' :
                    'Failed to add task')
            },
            taskToggleService: async (ctx, e) => {
                const task = e.value;

                // console.log('completing')
                // console.log({task})

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
            setForm: assign((ctx, e) => {
                const {task, due, cents} = e.value

                // console.log({task, due, cents})

                return {task, due, cents}
            }),
            resetForm: assign({
                task: "",
                taskHighlighted: null,
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
