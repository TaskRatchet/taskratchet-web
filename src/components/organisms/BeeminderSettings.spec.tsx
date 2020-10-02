/**  * @jest-environment jsdom-fourteen  */

import {render, RenderResult, waitFor} from "@testing-library/react";
import React from "react";
import BeeminderSettings from "./BeeminderSettings";
import api from "../../lib/Api";
import {loadMeWithBeeminder, loadUrlParams} from "../../lib/test/helpers";
import userEvent from '@testing-library/user-event'

jest.mock('../../lib/Api')

const renderBeeminderSettings = async (): Promise<RenderResult> => {
    return render(<BeeminderSettings/>)
}

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

        const {getByText} = await renderBeeminderSettings();

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

        const {getByText} = await renderBeeminderSettings();

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(getByText('Beeminder user: bm_user')).toBeDefined()
    })

    it('includes new tasks goal input', async () => {
        loadMeWithBeeminder()

        const {getByText} = await renderBeeminderSettings();

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(getByText('Post new tasks to goal:')).toBeDefined()
    })

    it('pre-fills goal name', async () => {
        loadMeWithBeeminder()

        const {getByDisplayValue} = await renderBeeminderSettings();

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(getByDisplayValue('bm_goal')).toBeDefined()
    })

    it('has save button', async () => {
        loadMeWithBeeminder()

        const {getByText} = await renderBeeminderSettings();

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(getByText('Save')).toBeDefined()
    })

    it('updates me', async () => {
        loadMeWithBeeminder()

        const {getByText} = await renderBeeminderSettings()

        await waitFor(() => expect(api.getMe).toBeCalled());

        userEvent.click(getByText('Save'))

        expect(api.updateMe).toBeCalled()
    })

    it('allows goal name change', async () => {
        loadMeWithBeeminder()

        const {getByDisplayValue} = await renderBeeminderSettings()

        await waitFor(() => expect(api.getMe).toBeCalled());

        const input = getByDisplayValue('bm_goal')

        await userEvent.type(input, '_new')

        expect(getByDisplayValue('bm_goal_new')).toBeDefined()
    })

    it('saves new goal', async () => {
        loadMeWithBeeminder()

        const {getByDisplayValue, getByText} = await renderBeeminderSettings()

        await waitFor(() => expect(api.getMe).toBeCalled());

        const input = getByDisplayValue('bm_goal')

        await userEvent.type(input, '_new')

        userEvent.click(getByText('Save'))

        expect(api.updateMe).toBeCalledWith({
            beeminder_goal_new_tasks: 'bm_goal_new'
        })
    })

    it('saves new integration', async () => {
        loadUrlParams({
            access_token: 'the_token',
            username: 'the_user'
        })

        await renderBeeminderSettings();

        expect(api.updateMe).toBeCalledWith({
            beeminder_token: 'the_token',
            beeminder_user: 'the_user'
        })
    })

    it('skips loadMe call on new connection', async () => {
        loadMeWithBeeminder('the_user')

        loadUrlParams({
            access_token: 'the_token',
            username: 'the_user'
        })

        const {getByText} = await renderBeeminderSettings();

        await waitFor(() => expect(getByText('Beeminder user: the_user')).toBeDefined())

        expect(api.getMe).not.toBeCalled()
    })
})

// TODO: Flatten folder structure
