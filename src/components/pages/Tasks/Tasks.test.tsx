/**  * @jest-environment jsdom-fourteen  */

import api, {Api} from "../../../classes/Api";
import {waitFor, render} from "@testing-library/react"
import Tasks from "."
import React from "react";

jest.mock('../../../classes/Api')

describe("tasks page", () => {
    it("loads tasks", async () => {
        (api.getTasks as jest.Mock).mockReturnValue({json: () => Promise.resolve([
                {
                    task: 'the_task',
                    id: 3
                }
            ])});
        (api.getMe as jest.Mock).mockReturnValue({json: () => Promise.resolve({})});

        const {getByText} = render(<Tasks />)

        await waitFor(() => expect(getByText('the_task')).toBeDefined())
    })
})

