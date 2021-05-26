import {loadNow, loadTasksApiData, makeTask} from "./lib/test/helpers";
import browser from "./lib/Browser";
import {render, waitFor} from "@testing-library/react";
import {updateTask} from "./lib/api";
import React from "react";
import {App} from "./App";
import userEvent from "@testing-library/user-event";
import {useSession} from "./lib/api/useSession";
import {MemoryRouter} from 'react-router-dom'

jest.mock('./lib/api/getTasks')
jest.mock('./lib/api/getMe')
jest.mock('./lib/api/updateTask')
jest.mock('./lib/api/addTask')
jest.mock('./lib/api/useSession')
jest.mock('./components/molecules/LoadingIndicator')
jest.mock('react-ga')

function renderPage() {
    return render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>)
}

describe('App', () => {
    const mockUseSession = (useSession as jest.Mock)

    beforeEach(() => {
        jest.resetAllMocks()
        loadNow(new Date('10/29/2020'))
        jest.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined)
    })

    it('re-scrolls tasks list when today icon clicked', async () => {
        mockUseSession.mockReturnValue({
            email: 'the_email'
        })

        loadNow(new Date('3/22/2020'))

        loadTasksApiData({
            tasks: [
                makeTask({due: "1/22/2020, 11:59 PM"})
            ]
        })

        const {getByText, container, getByLabelText} = await renderPage()

        await waitFor(() => expect(getByText((s) => s.indexOf('Today: March') !== -1)).toBeInTheDocument())

        const marker = container.querySelector('.organism-taskList__today')

        if (!marker) throw new Error('could not find marker')

        await waitFor(() => {
            expect(browser.scrollIntoView).toHaveBeenCalled()
        })

        userEvent.click(getByLabelText('today'))

        await waitFor(() => {
            expect(browser.scrollIntoView).toHaveBeenCalledTimes(2)
        })
    })
})
