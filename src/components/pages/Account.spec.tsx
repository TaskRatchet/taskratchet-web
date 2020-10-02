import {render, RenderResult, waitFor} from "@testing-library/react";
import React from "react";
import Account from './Account'
import api from "../../lib/Api"
import {loadCheckoutSession, loadMe, loadTimezones} from "../../lib/test/helpers";

jest.mock('../../lib/Api')

describe('account page', () => {
    it('includes Beeminder integration settings', async () => {
        loadTimezones();
        loadMe({})
        loadCheckoutSession();

        const {getByText} = await render(<Account />)

        expect(getByText("Enable Beeminder integration")).toBeDefined()
    })
})
