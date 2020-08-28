/**  * @jest-environment jsdom-fourteen  */

import api, {Api} from "../../../classes/Api";
import {waitFor, render, getByPlaceholderText} from "@testing-library/react"
import Tasks from "."
import React from "react";
import userEvent from '@testing-library/user-event'

jest.mock('../../../classes/Api')

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

describe("tasks page", () => {
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
})

