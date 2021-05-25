import * as new_api from "../../lib/api"
import {addTask, getMe, updateTask} from "../../lib/api"
import toaster from "../../lib/Toaster"
import {fireEvent, render, waitFor} from "@testing-library/react"
import Tasks from "./Tasks"
import React from "react";
import userEvent from '@testing-library/user-event'
import {
    expectLoadingOverlay,
    loadNow,
    makeResponse,
    makeTask,
    resolveWithDelay,
    withMutedReactQueryLogger,
} from "../../lib/test/helpers";
import {QueryClient, QueryClientProvider} from "react-query";
import _ from "lodash";
import {getUnloadMessage} from "../../lib/getUnloadMessage";

jest.mock('../../lib/api/apiFetch')
jest.mock('../../lib/api/getTasks')
jest.mock('../../lib/api/getMe')
jest.mock('../../lib/api/updateTask')
jest.mock('../../lib/api/getTimezones')
jest.mock('../../lib/api/addTask')
jest.mock("../../lib/Toaster")
jest.mock('../../lib/LegacyApi')
jest.mock('../../lib/getUnloadMessage')
jest.mock('react-ga')

global.document.createRange = () => ({
    setStart: () => {
    },
    setEnd: () => {
    },
    commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
    }
} as any)

const loadApiResponse = (
    mock: any,
    response: { json?: any, ok?: boolean } = {json: null, ok: true}
) => {
    (mock as jest.Mock).mockReturnValue(makeResponse(response))
}

const loadApiData = (
    {tasks = [], me = {}}: { tasks?: TaskType[], me?: object } = {}
) => {
    jest.spyOn(new_api, "getTasks").mockResolvedValue(tasks || [])
    jest.spyOn(new_api, "getMe").mockResolvedValue(me || {})

    loadApiResponse(updateTask);
    loadApiResponse(addTask)
}

const expectTaskSave = async (
    {
        task,
        due,
        cents = 500
    }: {
        task: string,
        due: Date,
        cents?: number
    }
) => {
    const dueString = due.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    await waitFor(() => expect(addTask).toBeCalledWith(task, dueString, cents))
}

const expectCheckboxState = (task: string, expected: boolean, getByText: any) => {
    const taskEl = getByText(task)
    const checkbox = taskEl.previousElementSibling

    expect(checkbox.checked).toEqual(expected)
}

const renderTasksPage = () => {
    const queryClient = new QueryClient()
    const getters = render(<QueryClientProvider client={queryClient}><Tasks/></QueryClientProvider>),
        {getByText, getByPlaceholderText} = getters

    return {
        taskInput: getByPlaceholderText("Task"),
        addButton: getByText("Add"),
        clickCheckbox: (task = "the_task") => {
            const desc = getByText(task),
                checkbox = desc.previousElementSibling

            if (!checkbox) {
                throw Error("Missing task checkbox")
            }

            userEvent.click(checkbox)
        },
        ...getters
    }
}

async function testParsesDueString(task: string, expected: string, ref: Date) {
    loadNow(ref)

    loadApiData()

    const {taskInput, getByText} = await renderTasksPage()

    await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

    await userEvent.type(taskInput, task)

    expect(getByText(expected)).toBeInTheDocument()
}

describe("tasks page", () => {
    beforeEach(() => {
        jest.resetAllMocks()
        loadNow(new Date('10/29/2020'))
    })

    it("loads tasks", async () => {
        loadApiData({tasks: [makeTask()]})

        const {getByText} = renderTasksPage()

        await waitFor(() => expect(getByText('the_task')).toBeDefined())
    })

    // it("saves task with free entry", async () => {
    //     loadNow(new Date('10/29/2020'))
    //     loadApiData()
    //
    //     const {taskInput, addButton} = renderTasksPage()
    //
    //     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
    //
    //     await userEvent.type(taskInput, "the_task by friday or pay $5")
    //     userEvent.click(addButton)
    //
    //     await expectTaskSave({
    //         task: "the_task by friday or pay $5",
    //         due: new Date('10/30/2020 11:59 PM'),
    //     })
    // })

    it("saves task", async () => {
        loadNow(new Date('10/29/2020'))
        loadApiData()

        const {taskInput, addButton} = renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "the_task")
        userEvent.click(addButton)

        await expectTaskSave({
            task: "the_task",
            due: new Date('11/05/2020 11:59 PM'),
            cents: 500
        })
    })

    it("resets task input", async () => {
        loadApiData()

        const {taskInput, addButton} = renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "new_task by Friday or pay $5")
        userEvent.click(addButton)

        await waitFor(() => expect(addTask).toHaveBeenCalled())

        expect((taskInput as HTMLInputElement).value).toBe("")
    })

    it("doesn't accept empty task", async () => {
        loadApiData()

        const {addButton} = renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        userEvent.click(addButton)

        expect(new_api.addTask).not.toHaveBeenCalled()
    })

    it("displays error on empty task submit", async () => {
        loadApiData()

        const {addButton, getByText} = renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        userEvent.click(addButton)

        expect(getByText("Task is required")).toBeDefined()
    })

    it("displays timezone", async () => {
        loadApiData({me: {timezone: "the_timezone"}})

        const {getByText} = renderTasksPage()

        await waitFor(() => expect(getMe).toHaveBeenCalled())

        expect(getByText("the_timezone")).toBeDefined()
    })

    it("tells api task is complete", async () => {
        loadApiData({
            tasks: [makeTask({id: 3})]
        })

        const {clickCheckbox} = renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        clickCheckbox()

        await waitFor(() => expect(updateTask).toBeCalledWith(3, {complete: true}))
    })

    it("reloads tasks", async () => {
        loadApiData({
            tasks: [makeTask({id: 3})]
        })

        const {clickCheckbox} = renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        clickCheckbox()

        await waitFor(() => expect(new_api.getTasks).toBeCalledTimes(2))
    })

    it("toasts task creation failure", async () => {
        await withMutedReactQueryLogger(async () => {
            loadApiData()
            jest.spyOn(new_api, 'addTask').mockImplementation(() => {
                throw new Error('Failed to add task')
            })

            const {taskInput, addButton} = renderTasksPage()

            await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

            await userEvent.type(taskInput, "the_task by Friday or pay $5")
            userEvent.click(addButton)

            await waitFor(() => expect(toaster.send)
                .toBeCalledWith("Error: Failed to add task"))
        })
    })

    it("toasts task creation exception", async () => {
        await withMutedReactQueryLogger(async () => {
            loadApiData();

            jest.spyOn(new_api, 'addTask').mockImplementation(() => {
                throw Error("Oops!")
            })

            const {taskInput, addButton} = renderTasksPage()

            await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

            await userEvent.type(taskInput, "the_task by Friday or pay $5")
            userEvent.click(addButton)

            await waitFor(() => expect(toaster.send)
                .toBeCalledWith("Error: Oops!"))
        })
    })

    it("toasts task toggle exception", async () => {
        await withMutedReactQueryLogger(async () => {
            loadApiData({
                tasks: [makeTask({id: 3})]
            });

            jest.spyOn(new_api, 'updateTask').mockImplementation(() => {
                throw Error("Oops!")
            })

            const {clickCheckbox} = renderTasksPage()

            await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

            clickCheckbox()

            await waitFor(() => expect(toaster.send)
                .toBeCalledWith("Error: Oops!"))
        })
    })

    // it("parses date", async () => {
    //     await testParsesDueString(
    //         "do x by Friday",
    //         'Friday, 10/30/2020, 11:59 PM',
    //         new Date('10/29/2020')
    //     );
    // })
    //
    // it("includes specific time", async () => {
    //     await testParsesDueString(
    //         "do x by Friday at 3pm",
    //         'Friday, 10/30/2020, 03:00 PM',
    //         new Date('10/29/2020')
    //     );
    // })
    //
    // it("uses last date in string", async () => {
    //     await testParsesDueString(
    //         "do january task by Friday at 3pm",
    //         'Friday, 10/30/2020, 03:00 PM',
    //         new Date('10/29/2020')
    //     );
    // })
    //
    // it("exposes no deadline", async () => {
    //     await testParsesDueString(
    //         "do the thing",
    //         'No deadline found',
    //         new Date('10/29/2020')
    //     );
    // })
    //
    // it("starts with no deadline", async () => {
    //     await testParsesDueString(
    //         "",
    //         'No deadline found',
    //         new Date('10/29/2020')
    //     );
    // })
    //
    // it("extracts stakes", async () => {
    //     loadApiData()
    //
    //     const {taskInput, getByText} = await renderTasksPage()
    //
    //     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
    //
    //     await userEvent.type(taskInput, 'do this or pay $100')
    //
    //     expect(getByText("$100")).toBeInTheDocument()
    // })
    //
    // it("starts without stakes", async () => {
    //     loadApiData()
    //
    //     const {getByText} = await renderTasksPage()
    //
    //     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
    //
    //     expect(getByText("No stakes found")).toBeInTheDocument()
    // })
    //
    // it("resets due date to null", async () => {
    //     loadApiData()
    //
    //     const {taskInput, addButton, getByText} = renderTasksPage()
    //
    //     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
    //
    //     await userEvent.type(taskInput, "the_task by Friday or pay $5")
    //     userEvent.click(addButton)
    //
    //     await waitFor(() => expect(getByText("No deadline found")).toBeInTheDocument())
    // })

    // it('highlights due date', async () => {
    //     loadApiData()
    //
    //     const {taskInput, getByText} = renderTasksPage()
    //
    //     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
    //
    //     await userEvent.type(taskInput, "the_task today or pay $5")
    //
    //     expect(getByText("today")).toBeInTheDocument()
    // })
    //
    // it('escapes tasks before echoing', async () => {
    //     loadApiData()
    //
    //     const {taskInput, getByText} = renderTasksPage()
    //
    //     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
    //
    //     await userEvent.type(taskInput, "the_task <span>malicious</span>")
    //
    //     expect(() => getByText("malicious")).toThrow()
    // })
    //
    // it('echos unhighlighted', async () => {
    //     loadApiData()
    //
    //     const {taskInput, getByText} = renderTasksPage()
    //
    //     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
    //
    //     await userEvent.type(taskInput, "abc today def")
    //
    //     expect(getByText((m) => m.endsWith('def'))).toBeInTheDocument()
    // })
    //
    // it('highlights pledge', async () => {
    //     loadApiData()
    //
    //     const {taskInput, getByText} = renderTasksPage()
    //
    //     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
    //
    //     await userEvent.type(taskInput, "do for $9")
    //
    //     expect(getByText('$9')).toBeInTheDocument()
    // })

    it('uses loading overlay', async () => {
        loadApiData()

        const {container} = renderTasksPage()

        expectLoadingOverlay(container)
    })

    it('updates checkboxes optimistically', async () => {
        loadApiData({
            tasks: [makeTask({id: 3})]
        })

        const {clickCheckbox, getByText} = renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        clickCheckbox()

        await waitFor(() => {
            const taskDesc = getByText('the_task')
            const taskCheckbox = _.get(taskDesc, 'parentNode.firstChild');
            expect(taskCheckbox.checked).toBeTruthy()
        })
    })

    it('rolls back checkbox optimistic update', async () => {
        await withMutedReactQueryLogger(async () => {
            loadApiData({
                tasks: [makeTask({id: 3, status: 'pending'})]
            })

            const {clickCheckbox, getByText} = renderTasksPage()

            await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

            jest.spyOn(new_api, 'updateTask').mockRejectedValue('Oops!')

            clickCheckbox()

            await waitFor(() => {
                const taskDesc = getByText('the_task')
                const taskCheckbox = _.get(taskDesc, 'parentNode.firstChild');
                expect(taskCheckbox.checked).toBeTruthy()
            })

            await waitFor(() => {
                const taskDesc = getByText('the_task')
                const taskCheckbox = _.get(taskDesc, 'parentNode.firstChild');
                expect(taskCheckbox.checked).toBeFalsy()
            })
        })
    })

    it('gets unload warning', async () => {
        loadApiData({
            tasks: [makeTask({id: 3})]
        })

        const {clickCheckbox} = await renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        const event = new Event('beforeunload')

        clickCheckbox()
        fireEvent(window, event)

        expect(getUnloadMessage).toBeCalled()
    })

    it('checking multiple tasks not clobbered by invalidated queries', async () => {
        // Setup & initial render

        loadApiData({
            tasks: [
                makeTask({task: 'first', id: 3}),
                makeTask({task: 'second', id: 4}),
            ]
        })

        const {clickCheckbox, getByText} = await renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        // Load slow query response to clobber

        resolveWithDelay(jest.spyOn(new_api, 'getTasks'), 100, [
            makeTask({task: 'first', id: 3, status: 'complete', complete: true}),
            makeTask({task: 'second', id: 4, status: 'pending'}),
        ])

        // Check first task

        clickCheckbox('first')

        // Wait for slow response to be requested

        await waitFor(() => expect(new_api.getTasks).toBeCalledTimes(2))

        // Load second, fast response

        jest.spyOn(new_api, 'getTasks').mockResolvedValue([
            makeTask({task: 'first', id: 3, status: 'complete', complete: true}),
            makeTask({task: 'second', id: 4, status: 'complete', complete: true}),
        ])

        // Check second task

        clickCheckbox('second')

        // Sleep 200ms

        await new Promise((resolve) => setTimeout(resolve, 200))

        // Check that first, slow response didn't clobber second, fast response

        expectCheckboxState('second', true, getByText)
    })

    it('has stakes form', async () => {
        loadApiData()

        const {getByText} = renderTasksPage()

        expect(getByText("Stakes")).toBeInTheDocument()
    })

    it('adds task optimistically', async () => {
        const {taskInput, addButton, getByText} = renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "the_task")
        userEvent.click(addButton)

        await waitFor(() => expect(getByText('the_task')).toBeInTheDocument())
    })

    it('rolls back task add if mutation fails', async () => {
        await withMutedReactQueryLogger(async () => {
            loadApiData()

            jest.spyOn(new_api, 'addTask').mockRejectedValue('Oops!')

            const {taskInput, addButton, getByText, queryByText} = renderTasksPage()

            await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

            await userEvent.type(taskInput, "the_task")
            userEvent.click(addButton)

            await waitFor(() => {
                expect(getByText('the_task')).toBeInTheDocument()
            })

            await waitFor(() => {
                expect(queryByText('the_task')).toBeNull()
            })
        })
    })

    it('cancels fetches on-mutate', async () => {
        // Setup & initial render

        loadApiData()

        const {taskInput, addButton, getByText} = await renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        // Load slow query response to clobber

        resolveWithDelay(jest.spyOn(new_api, 'getTasks'), 100, [
            makeTask({task: 'first', id: 3}),
        ])

        // Add first task

        await userEvent.type(taskInput, "first")
        userEvent.click(addButton)

        // Wait for slow response to be requested

        await waitFor(() => expect(new_api.getTasks).toBeCalledTimes(2))

        // Load second, fast response

        jest.spyOn(new_api, 'getTasks').mockResolvedValue([
            makeTask({task: 'first', id: 3}),
            makeTask({task: 'second', id: 4}),
        ])

        // Add second task

        await userEvent.type(taskInput, "second")
        userEvent.click(addButton)

        // Sleep 200ms

        await new Promise((resolve) => setTimeout(resolve, 200))

        // Check that first, slow response didn't clobber second, fast response

        expect(getByText('second')).toBeInTheDocument()
    })

    it('shows all tasks', async () => {
        loadApiData({
            tasks: [makeTask({complete: true})]
        })

        const {getByText} = await renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        expect(getByText('the_task')).toBeInTheDocument()
    })

    it('shows date headings', async () => {
        loadApiData({tasks: [
            makeTask({due: "5/22/2020, 11:59 PM"})
        ]})

        const {getByText} = await renderTasksPage()

        await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())

        expect(getByText('May 22, 2020')).toBeInTheDocument()
    })

    it('shows today marker', async () => {
        loadNow(new Date('3/22/2020'))

        loadApiData({tasks: [
            makeTask({due: "1/22/2020, 11:59 PM"}),
            makeTask({due: "5/22/2020, 11:59 PM"})
        ]})

        const {getByText, container} = await renderTasksPage()

        await waitFor(() => expect(getByText((s) => s.indexOf('Today: March') !== -1)).toBeInTheDocument())

        const list = container.querySelector('.organism-taskList > ul')

        if (!list) throw new Error('could not find list')

        expect(list.childNodes[1].textContent).toContain('Today')
    })

    it('shows today marker at end with no future dues', async () => {
        loadNow(new Date('3/22/2020'))

        loadApiData({tasks: [
                makeTask({due: "1/22/2020, 11:59 PM"})
            ]})

        const {getByText, container} = await renderTasksPage()

        await waitFor(() => expect(getByText((s) => s.indexOf('Today: March') !== -1)).toBeInTheDocument())

        const list = container.querySelector('.organism-taskList > ul')

        if (!list) throw new Error('could not find list')

        expect(list.childNodes[1].textContent).toContain('Today')
    })

    // TODO: scroll to today on page load

    // box.scrollTo({behavior: 'smooth', top: 300})


    // TODO: add pending filter
    // TODO: Pull initial stakes & due date from most-recently added task
    // TODO: Uncomment and fix tasks related to free-entry form
    // TODO: Fail on console errors: https://github.com/facebook/jest/issues/6121#issuecomment-529591574
})

