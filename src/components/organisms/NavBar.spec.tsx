import {render} from "@testing-library/react";
import React from "react";
import NavBar from "./NavBar";
import {useSession} from "../../lib/api/useSession";
import userEvent from "@testing-library/user-event";
import {waitFor} from "@testing-library/dom";
import {BrowserRouter} from "react-router-dom";

jest.mock('../../lib/api/useSession')

async function renderComponent() {
    return render(<BrowserRouter><NavBar /></BrowserRouter>)
}

describe('NavBar',  () => {
    const mockUseSession = (useSession as jest.Mock)

    it('displays email', async () => {
        mockUseSession.mockReturnValue({
            email: 'the_email'
        })

        const {getByText} = await renderComponent()

        expect(getByText('the_email')).toBeInTheDocument()
    })

    it('initially hides Logout button', async () => {
        mockUseSession.mockReturnValue({
            email: 'the_email'
        })

        const {queryByText} = await renderComponent()

        expect(queryByText('Logout')).not.toBeInTheDocument()
    })

    it('displays Logout button when menu activated', async () => {
        mockUseSession.mockReturnValue({
            email: 'the_email'
        })

        const {getByText, getByLabelText} = await renderComponent()

        userEvent.click(getByLabelText('menu'))

        expect(getByText('Logout')).toBeInTheDocument()
    })

    it('deactivates menu when backdrop clicked', async () => {
        mockUseSession.mockReturnValue({
            email: 'the_email'
        })

        const {baseElement, getByLabelText, queryByText} = await renderComponent()

        userEvent.click(getByLabelText('menu'))

        const bg = baseElement.querySelector('.MuiBackdrop-root')

        if (!bg) throw new Error('could not find drawer bg')

        userEvent.click(bg)

        await waitFor(() => {
            expect(queryByText('Logout')).not.toBeInTheDocument()
        })
    })

    it('does not display logout link if no session', async () => {
        const {queryByText, getByLabelText} = await renderComponent()

        userEvent.click(getByLabelText('menu'))

        expect(queryByText('Logout')).not.toBeInTheDocument()
    })
})
