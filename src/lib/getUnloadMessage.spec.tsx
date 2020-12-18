import {getUnloadMessage} from "./getUnloadMessage";
import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {renderHook} from "@testing-library/react-hooks"
import {useSetComplete} from "./api/useSetComplete";
import * as api from "./api"
import {renderWithQueryProvider} from "./test/helpers";

jest.mock('./api/setComplete')

describe('getUnloadMessage', () => {
    it('does not return message if no pending mutations', async () => {
        const {queryClient} = await renderWithQueryProvider(<div>Hello World</div>)

        expect(getUnloadMessage(queryClient)).toBeFalsy()
    })

    it('returns message if pending task toggle', async () => {
        jest.spyOn(api, 'setComplete').mockImplementation(() => {
            return new Promise((resolve) => setTimeout(resolve, 200))
        })

        const Component = () => {
            const setComplete = useSetComplete()

            setComplete(-1, true)

            return <div>Component</div>
        }

        const {queryClient} = await renderWithQueryProvider(<Component />)

        const expected = "There are changes that may be lost if you continue exiting.";

        expect(getUnloadMessage(queryClient)).toEqual(expected)
    })
})
