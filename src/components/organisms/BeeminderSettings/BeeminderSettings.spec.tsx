/**  * @jest-environment jsdom-fourteen  */

import {render, waitFor} from "@testing-library/react";
import React from "react";
import BeeminderSettings from "./index";
import api from "../../../lib/Api";
import {loadMe, loadMeWithBeeminder, makeResponse} from "../../../lib/test/helpers";

jest.mock('../../../lib/Api')

describe("BeeminderSettings component", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("renders", async () => {
        render(<BeeminderSettings/>)
    })

    it("includes enable link", async () => {
        const {getByText} = await render(<BeeminderSettings/>)

        expect(getByText("Enable Beeminder integration")).toBeDefined()
    })

    it("gets me", async () => {
        await render(<BeeminderSettings/>)

        expect(api.getMe).toBeCalled()
    })

    it("does not include enable link if enabled", async () => {
        loadMeWithBeeminder()

        const {getByText} = await render(<BeeminderSettings/>);

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(() => getByText("Enable Beeminder integration")).toThrow();
    })

    it('sets enable link href', async () => {
        const {getByText} = await render(<BeeminderSettings/>),
            link = getByText("Enable Beeminder integration")

        expect((link as HTMLAnchorElement).href).toContain('https://www.beeminder.com')
    })

    it('displays beeminder user', async () => {
        loadMeWithBeeminder()

        const {getByText} = await render(<BeeminderSettings/>);

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(getByText('Beeminder user: bm_user')).toBeDefined()
    })

    it('includes new tasks goal input', async () => {
        loadMeWithBeeminder()

        const {getByText} = await render(<BeeminderSettings/>);

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(getByText('Post new tasks to goal:')).toBeDefined()
    })

    it('pre-fills goal name', async () => {
        loadMeWithBeeminder()

        const {getByDisplayValue} = await render(<BeeminderSettings/>);

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(getByDisplayValue('bm_goal')).toBeDefined()
    })

    it('has save button', async () => {
        loadMeWithBeeminder()

        const {getByText} = await render(<BeeminderSettings/>);

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(getByText('Save')).toBeDefined()
    })
})

// TODO: Flatten folder structure
