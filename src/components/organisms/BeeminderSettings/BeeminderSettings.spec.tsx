import {render} from "@testing-library/react";
import React from "react";
import BeeminderSettings from "./index";
import api from "../../../classes/Api";

jest.mock('../../../classes/Api')

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
})

// TODO: Flatten folder structure
