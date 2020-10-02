/**  * @jest-environment jsdom-fourteen  */

import {render, waitFor} from "@testing-library/react";
import React from "react";
import BeeminderSettings from "./index";
import api from "../../../lib/Api";
import {makeResponse} from "../../../lib/test/helpers";

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
        jest.spyOn(api, 'getMe').mockResolvedValue(makeResponse({
            json: {
                integrations: {
                    beeminder: {
                        user: 'bm_user'
                    }
                }
            }
        }))

        const {getByText} = await render(<BeeminderSettings/>);

        await waitFor(() => expect(api.getMe).toBeCalled());

        expect(() => getByText("Enable Beeminder integration")).toThrow();
    })
})

// TODO: Flatten folder structure
