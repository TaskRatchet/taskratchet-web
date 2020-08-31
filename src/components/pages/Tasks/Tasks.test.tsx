/**  * @jest-environment jsdom-fourteen  */

import api from "../../../classes/Api";
import {getByPlaceholderText, render, waitFor} from "@testing-library/react"
import Tasks from "."
import React from "react";
import userEvent from '@testing-library/user-event'

jest.mock('../../../classes/Api')

global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
    }
} as any)

const makeResponse = ({ok = true, json = ''} = {}) => {
    return {ok, json: () => Promise.resolve(json)}
}

const loadApiResponse = (mock: any, data: any) => {
    (mock as jest.Mock).mockReturnValue(makeResponse({json: data}))
}

const loadApiData = (
    {tasks = [], me = {}}: { tasks?: Task[], me?: object } = {}
) => {
    loadApiResponse(api.getTasks, tasks || []);
    loadApiResponse(api.getMe, me || {});

    (api.addTask as jest.Mock).mockReturnValue(Promise.resolve(makeResponse()))
}

const makeTask = (
    {
        complete = true,
        due = 0,
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
        task = "",
        due = getDefaultDueDate(),
        cents = 500
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

        const {getAllByText, getByText, getByPlaceholderText} = render(<Tasks/>)

        const taskBox = getByPlaceholderText("Task"),
            addButton = getByText("Add")

        loadApiData({
            tasks: [
                makeTask({task: 'a'})
            ]
        })
        await userEvent.type(taskBox, "a")
        userEvent.click(addButton)

        loadApiData({
            tasks: [
                makeTask({task: 'a'}),
                makeTask({task: 'b'})
            ]
        })
        await userEvent.type(taskBox, "b")
        userEvent.click(addButton)

        loadApiData({
            tasks: [
                makeTask({task: 'a'}),
                makeTask({task: 'b'}),
                makeTask({task: 'c'}),
                makeTask({task: 'done'})
            ]
        })
        await userEvent.type(taskBox, "c")
        userEvent.click(addButton)

        await waitFor(() => getByText("done"))

        expect(getAllByText("c").length).toBe(1)
    })

    it("saves task", async () => {
        loadApiData()

        const {getByText, getByPlaceholderText} = render(<Tasks/>)

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        const taskBox = getByPlaceholderText("Task"),
            addButton = getByText("Add")

        await userEvent.type(taskBox, "the_task")
        userEvent.click(addButton)

        expectTaskSave({task: "the_task"})
    })

    it("allows cents change", async () => {
        loadApiData()

        const {getByText, getByPlaceholderText} = render(<Tasks/>)

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        const centsInput = getByPlaceholderText("USD"),
            addButton = getByText("Add")

        await userEvent.type(centsInput, "{backspace}15")
        userEvent.click(addButton)

        expectTaskSave({cents: 1500})
    })

    it("allows due change", async () => {
        loadApiData()

        const {getByText, getByPlaceholderText} = render(<Tasks/>)

        await waitFor(() => expect(api.getTasks).toHaveBeenCalled())

        // @ts-ignore
        const dueInput = getByText("Due")
            .firstElementChild
            .firstElementChild
            .firstElementChild

        if (!dueInput) {
            throw Error("Missing due input")
        }

        await userEvent.type(dueInput, "{backspace}{backspace}AM")

        userEvent.click(getByText("Add"))

        const due = getDefaultDueDate();

        due.setHours(11);

        expectTaskSave({due})
    })

    // TODO: Test that new task added to list optimistically
})

