import {render, waitFor} from "@testing-library/react";
import React from "react";
import Account from './Account'
import {
    expectLoadingOverlay,
    loadCheckoutSession,
    loadMe,
    loadTimezones,
    renderWithQueryProvider
} from "../../lib/test/helpers";
import {QueryClient, QueryClientProvider} from "react-query";
import userEvent from "@testing-library/user-event";

jest.mock('../../lib/api/getTimezones')
jest.mock('../../lib/api/getMe')
jest.mock('../../lib/api/updateMe')
jest.mock('../../lib/api/getCheckoutSession')
jest.mock('../../lib/api/apiFetch')

describe('account page', () => {
    it('includes Beeminder integration settings', async () => {
        loadTimezones();
        loadMe({})
        loadCheckoutSession();

        // TODO: extract renderWithClientProvider to helpers
        const queryClient = new QueryClient()
        const {getByText} = await render(<QueryClientProvider client={queryClient}><Account/></QueryClientProvider>)

        expect(getByText("Enable Beeminder integration")).toBeDefined()
    })

    it('loads name', async () => {
        loadMe({
            json: {
                name: "the_name"
            }
        })

        const {getByDisplayValue} = await renderWithQueryProvider(<Account/>)

        await waitFor(() => expect(getByDisplayValue('the_name')).toBeInTheDocument())
    })

    it('loads email', async () => {
        loadMe({
            json: {
                email: "the_email"
            }
        })

        const {getByDisplayValue} = await renderWithQueryProvider(<Account/>)

        await waitFor(() => expect(getByDisplayValue('the_email')).toBeInTheDocument())
    })

    it('uses loading overlay', async () => {
        loadMe({})

        const {container} = await renderWithQueryProvider(<Account/>)

        expectLoadingOverlay(container, {extraClasses: 'page-account'})
    })

    it('loads timezone', async () => {
        loadTimezones([
            'first',
            "America/Indiana/Knox",
            'third'

        ])

        loadMe({
            json: {
                timezone: "America/Indiana/Knox"
            }
        })

        const {getByDisplayValue} = await renderWithQueryProvider(<Account/>)

        await waitFor(() => expect(getByDisplayValue("America/Indiana/Knox")).toBeInTheDocument())
    })

    it('uses loading overlay on fetch', async () => {
        loadMe({})

        const {container, getAllByText} = await renderWithQueryProvider(<Account/>)

        const button = getAllByText('Save')[0]

        await waitFor(() => expectLoadingOverlay(container, {extraClasses: 'page-account', shouldExist: false}))

        userEvent.click(button)

        await waitFor(() => expectLoadingOverlay(container, {extraClasses: 'page-account'}))
    })
})
