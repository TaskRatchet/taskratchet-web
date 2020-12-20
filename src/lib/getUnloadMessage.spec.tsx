import {getUnloadMessage} from "./getUnloadMessage";
import React from "react";
import {useUpdateTask} from "./api/useUpdateTask";
import * as api from "./api"
import {renderWithQueryProvider, resolveWithDelay} from "./test/helpers";

jest.mock('./api/updateTask')

describe('getUnloadMessage', () => {
    it('does not return message if no pending mutations', async () => {
        const {queryClient} = await renderWithQueryProvider(<div>Hello World</div>)

        expect(getUnloadMessage(queryClient)).toBeFalsy()
    })

    it('returns message if pending task toggle', async () => {
        resolveWithDelay(jest.spyOn(api, 'updateTask'), 200)

        const Component = () => {
            const updateTask = useUpdateTask()

            updateTask(-1, {complete: true})

            return <div>Component</div>
        }

        const {queryClient} = await renderWithQueryProvider(<Component />)

        const expected = "There are changes that may be lost if you continue exiting.";

        expect(getUnloadMessage(queryClient)).toEqual(expected)
    })
})
