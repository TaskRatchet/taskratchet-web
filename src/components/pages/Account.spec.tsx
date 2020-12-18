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
import * as api from '../../lib/api'

jest.mock('../../lib/api/getTimezones')
jest.mock('../../lib/api/getMe')
jest.mock('../../lib/api/updateMe')
jest.mock('../../lib/api/getCheckoutSession')
jest.mock('../../lib/api/apiFetch')
jest.mock('../../lib/api/updatePassword')

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

    it('uses loading screen when saving password', async () => {
        loadMe({})

        jest.spyOn(api, 'updatePassword').mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

        const {container, getAllByText, getByLabelText} = await renderWithQueryProvider(<Account/>)

        const button = getAllByText('Save')[1]

        await waitFor(() => expectLoadingOverlay(container, {extraClasses: 'page-account', shouldExist: false}))

        userEvent.type(getByLabelText('Old Password'), 'old')
        userEvent.type(getByLabelText('New Password'), 'new')
        userEvent.type(getByLabelText('Retype Password'), 'new')
        userEvent.click(button)

        await waitFor(() => expectLoadingOverlay(container, {extraClasses: 'page-account'}))
    })

    it('loads payment methods', async () => {
        loadMe({
            json: {
                cards: [{
                    brand: "visa",
                    last4: "1111"
                }]
            }
        })

        const {getByText} = await renderWithQueryProvider(<Account/>)

        await waitFor(() => expect(getByText('visa ending with 1111')).toBeInTheDocument())
    })

    // TODO: test replace payment method
    // TODO: load beeminder integration
    // TODO: test enable beeminder integration
    // TODO: break sections into their own components
    // TODO: get rid of test run terminal errors
})
