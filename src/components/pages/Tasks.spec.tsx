/**  * @jest-environment jsdom-fourteen  */

import api from "../../lib/Api";
import toaster from "../../lib/Toaster"
import {getByPlaceholderText, render, waitFor} from "@testing-library/react"
import Tasks from "./Tasks"
import React from "react";
import userEvent from '@testing-library/user-event'
import {loadNow, makeResponse} from "../../lib/test/helpers";

jest.mock('../../lib/Api')
jest.mock("../../lib/Toaster")

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
    {tasks = [], me = {}}: { tasks?: Task[], me?: object } = {}
) => {
    loadApiResponse(api.getTasks, {json: tasks || []});
    loadApiResponse(api.getMe, {json: me || {}});
    loadApiResponse(api.setComplete);
    loadApiResponse(api.addTask)
}

const makeTask = (
    {
        complete = false,
        due = "5/22/2020, 11:59 PM",
        id = Math.random(),
        cents = 0,
        task = 'the_task',
        charge_locked = null,
        charge_authorized = null,
        charge_captured = null
    } = {}
): Task => {
    return {
        complete,
        due,
        id,
        cents,
        task,
        charge_locked,
        charge_authorized,
        charge_captured,
    }
}

const getDefaultDueDate = () => {
    const due = new Date();

    due.setDate(due.getDate() + 7);
    due.setHours(23);
    due.setMinutes(59);

    return due;
}

const expectTaskSave = (
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

    expect(api.addTask).toBeCalledWith(task, dueString, cents)
}

const renderTasksPage = () => {
    const getters = render(<Tasks/>),
        {getByText, getByPlaceholderText} = getters,
        // @ts-ignore
        dueInput = getByText("Due")
            .firstElementChild
            .firstElementChild
            .firstElementChild

    if (!dueInput) {
        throw Error("Missing due input")
    }

    return {
        taskInput: getByPlaceholderText("Task"),
        dueInput,
        centsInput: getByPlaceholderText("USD"),
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

    await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

    await userEvent.type(taskInput, task)

    expect(getByText(expected)).toBeInTheDocument()
}

describe("tasks page", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("loads tasks", async () => {
        loadApiData({tasks: [makeTask()]})

        const {getByText} = render(<Tasks/>)

        await waitFor(() => expect(getByText('the_task')).toBeDefined())
    })

    it("only shows one of each created task", async () => {
        loadApiData()

        const {taskInput, addButton, getByText, getAllByText} = renderTasksPage()

        loadApiData({
            tasks: [
                makeTask({task: 'a'})
            ]
        })
        await userEvent.type(taskInput, "a")
        userEvent.click(addButton)

        loadApiData({
            tasks: [
                makeTask({task: 'a'}),
                makeTask({task: 'b'})
            ]
        })
        await userEvent.type(taskInput, "b")
        userEvent.click(addButton)

        loadApiData({
            tasks: [
                makeTask({task: 'a'}),
                makeTask({task: 'b'}),
                makeTask({task: 'c'}),
                makeTask({task: 'done'})
            ]
        })
        await userEvent.type(taskInput, "c")
        userEvent.click(addButton)

        await waitFor(() => getByText("done"))

        expect(getAllByText("c").length).toBe(1)
    })

    it("saves task", async () => {
        loadNow(new Date('10/29/2020'))
        loadApiData()

        const {taskInput, addButton} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "the_task by friday")
        userEvent.click(addButton)

        expectTaskSave({
            task: "the_task by friday",
            due: new Date('10/30/2020 11:59 PM'),
        })
    })

    it("allows cents change", async () => {
        loadNow(new Date('10/29/2020'))
        loadApiData()

        const {taskInput, centsInput, addButton} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "new_task by friday")
        await userEvent.type(centsInput, "{backspace}15")
        userEvent.click(addButton)

        expectTaskSave({
            task: "new_task by friday",
            due: new Date('10/30/2020 11:59 PM'),
            cents: 1500
        })
    })

    it("resets task input", async () => {
        loadApiData()

        const {taskInput, addButton} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "new_task by Friday")
        userEvent.click(addButton)

        await waitFor(() => expect(api.addTask).toHaveBeenCalled())

        expect((taskInput as HTMLInputElement).value).toBe("")
    })

    it("doesn't accept empty task", async () => {
        loadApiData()

        const {addButton} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        userEvent.click(addButton)

        expect(api.addTask).not.toHaveBeenCalled()
    })

    it("displays error on empty task submit", async () => {
        loadApiData()

        const {addButton, getByText} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        userEvent.click(addButton)

        expect(getByText("Task is required")).toBeDefined()
    })

    it("displays timezone", async () => {
        loadApiData({me: {timezone: "the_timezone"}})

        const {getByText} = renderTasksPage()

        await waitFor(() => expect(api.getMe).toHaveBeenCalled())

        expect(getByText("the_timezone")).toBeDefined()
    })

    it("tells api task is complete", async () => {
        loadApiData({
            tasks: [makeTask({id: 3})]
        })

        const {clickCheckbox} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        clickCheckbox()

        expect(api.setComplete).toBeCalledWith(3, true)
    })

    it("reloads tasks", async () => {
        loadApiData({
            tasks: [makeTask({id: 3})]
        })

        const {clickCheckbox} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        clickCheckbox()

        await waitFor(() => expect(api.getTasks).toBeCalledTimes(2))
    })

    it("toasts success message", async () => {
        loadApiData({
            tasks: [makeTask({id: 3})]
        })

        const {clickCheckbox} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        clickCheckbox()

        await waitFor(() => expect(toaster.send)
            .toBeCalledWith("Successfully marked task complete"))
    })

    it("toasts task creation success", async () => {
        loadApiData()

        const {taskInput, addButton} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "the_task by Friday")
        userEvent.click(addButton)

        await waitFor(() => expect(toaster.send)
            .toBeCalledWith("Task added successfully"))
    })

    it("toasts task creation failure", async () => {
        loadApiData()
        loadApiResponse(api.addTask, {ok: false})

        const {taskInput, addButton} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "the_task by Friday")
        userEvent.click(addButton)

        await waitFor(() => expect(toaster.send)
            .toBeCalledWith("Failed to add task"))
    })

    it("toasts data loading exception", async () => {
        (api.getTasks as jest.Mock).mockImplementation(() => {
            throw Error("Oops!")
        })

        renderTasksPage()

        await waitFor(() => expect(toaster.send)
            .toBeCalledWith("Error: Oops!"))
    })

    it("toasts task creation exception", async () => {
        loadApiData();

        (api.addTask as jest.Mock).mockImplementation(() => {
            throw Error("Oops!")
        })

        const {taskInput, addButton} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        await userEvent.type(taskInput, "the_task by Friday")
        userEvent.click(addButton)

        await waitFor(() => expect(toaster.send)
            .toBeCalledWith("Error: Oops!"))
    })

    it("toasts task toggle exception", async () => {
        loadApiData({
            tasks: [makeTask({id: 3})]
        });

        (api.setComplete as jest.Mock).mockImplementation(() => {
            throw Error("Oops!")
        })

        const {clickCheckbox} = renderTasksPage()

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        clickCheckbox()

        await waitFor(() => expect(toaster.send)
            .toBeCalledWith("Error: Oops!"))
    })

    it("parses date", async () => {
        await testParsesDueString(
            "do x by Friday",
            'Friday, 10/30/2020, 11:59 PM',
            new Date('10/29/2020')
        );
    })

    it("includes specific time", async () => {
        await testParsesDueString(
            "do x by Friday at 3pm",
            'Friday, 10/30/2020, 03:00 PM',
            new Date('10/29/2020')
        );
    })

    it("uses last date in string", async () => {
        await testParsesDueString(
            "do january task by Friday at 3pm",
            'Friday, 10/30/2020, 03:00 PM',
            new Date('10/29/2020')
        );
    })

    it("exposes no deadline", async () => {
        await testParsesDueString(
            "do the thing",
            'No deadline found',
            new Date('10/29/2020')
        );
    })
})

