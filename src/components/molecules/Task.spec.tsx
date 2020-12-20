import Task from "./Task";
import {render} from "@testing-library/react";
import React from "react";

describe('Task componet', () =>  {
    it('disbales checkbox for tasks without id', async () => {
        const {container} = await render(<Task task={{
            due: 'the_due',
            cents: 100,
            task: 'the_task'
        }} onToggle={() => null} />)

        const checkbox = container.querySelector('input')

        expect(checkbox && checkbox.disabled).toBeTruthy()
    })
})
