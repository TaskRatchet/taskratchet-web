import Task from "./Task";
import {render} from "@testing-library/react";
import React from "react";
import {renderWithQueryProvider} from "../../lib/test/helpers";

describe('Task componet', () =>  {
    it('disbales checkbox for tasks without id', async () => {
        const {container} = await renderWithQueryProvider(<Task task={{
            due: 'the_due',
            cents: 100,
            task: 'the_task'
        }} />)

        const checkbox = container.querySelector('input')

        expect(checkbox && checkbox.disabled).toBeTruthy()
    })
})
