import {render} from "@testing-library/react";
import React from "react";
import Account from './Account'
import {loadCheckoutSession, loadMe, loadTimezones} from "../../lib/test/helpers";
import {QueryClient, QueryClientProvider} from "react-query";

jest.mock('../../lib/api/getTimezones')
jest.mock('../../lib/api/getMe')
jest.mock('../../lib/api/getCheckoutSession')

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
})
