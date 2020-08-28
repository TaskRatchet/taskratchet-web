/**  * @jest-environment jsdom-fourteen  */

import api, {Api} from "../../../classes/Api";
import {waitFor, render} from "@testing-library/react"
import Tasks from "."
import React from "react";

jest.mock('../../../classes/Api')

const loadApiData = ({tasks = [], me = {}}: { tasks?: Task[], me?: object }) => {
    (api.getTasks as jest.Mock).mockReturnValue({json: () => Promise.resolve(tasks || [])});
    (api.getMe as jest.Mock).mockReturnValue({json: () => Promise.resolve(me || {})});
}

const makeTask = (
    {
        complete = true,
        due = 0,
        id = 0,
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
})

