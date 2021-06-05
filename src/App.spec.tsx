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
                makeTask({due: "1/22/2024, 11:59 PM"})
            ]
        })

        const {getByText, getByLabelText} = await renderPage()

        await waitFor(() => expect(getByText((s) => s.indexOf('January') !== -1)).toBeInTheDocument())

        const heading = getByText((s) => s.indexOf('January') !== -1)

        if (!heading) throw new Error('could not find marker')

        await waitFor(() => {
            expect(browser.scrollIntoView).toHaveBeenCalled()
        })

        userEvent.click(getByLabelText('today'))

        await waitFor(() => {
            expect(browser.scrollIntoView).toHaveBeenCalledTimes(2)
        })
    })

    it('calculates highlight index properly', async () => {
        mockUseSession.mockReturnValue({
            email: 'the_email'
        })

        loadNow(new Date('1/1/2020'))

        loadTasksApiData({
            tasks: [
                makeTask({due: "1/1/2020, 11:59 PM", task: "task 1"}),
                makeTask({due: "1/2/2020, 11:59 PM", task: "task 2",}),
                makeTask({due: "1/3/2020, 11:59 PM", task: "task 3",}),
                makeTask({due: "1/4/2020, 11:59 PM", task: "task 4",}),
                makeTask({due: "1/5/2020, 11:59 PM", task: "task 5",}),
                makeTask({due: "1/6/2020, 11:59 PM", task: "task 6",}),
                makeTask({due: "1/7/2020, 11:59 PM", task: "task 7",}),
                makeTask({due: "1/8/2020, 11:59 PM", task: "task 8",}),
                makeTask({due: "1/9/2020, 11:59 PM", task: "task 9",}),
                makeTask({due: "1/10/2020, 11:59 PM", task: "task 10"}),
                makeTask({due: "1/11/2020, 11:59 PM", task: "task 11"}),
                makeTask({due: "1/12/2020, 11:59 PM", task: "task 12"}),
                makeTask({due: "1/13/2020, 11:59 PM", task: "task 13"}),
                makeTask({due: "1/14/2020, 11:59 PM", task: "task 14"}),
                makeTask({due: "1/15/2020, 11:59 PM", task: "task 15"}),
                makeTask({due: "1/16/2020, 11:59 PM", task: "task 16"}),
                makeTask({due: "1/17/2020, 11:59 PM", task: "task 17"}),
                makeTask({due: "1/18/2020, 11:59 PM", task: "task 18", isNew: true}),
            ]
        })

        const {container, getAllByText} = await renderPage()

        await waitFor(() => {
            const allByText = getAllByText((s) => s.indexOf('January') !== -1);
            expect(allByText[0]).toBeInTheDocument()
        })

        expect(container.querySelector('.molecule-task__highlight')).toHaveTextContent('task 18')
    })
})

// TODO: only highlights task on creation, not on re-load from server
// do this by using a new: bool prop on newly-created tasks for highlight filtering
