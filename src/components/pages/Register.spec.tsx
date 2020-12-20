import {loadTimezones, renderWithQueryProvider} from "../../lib/test/helpers";
import React from "react";
import Register from "./Register";
import {waitFor} from "@testing-library/dom";

describe('registration page', () => {
    it('uses timezone loading placeholder', async () => {
        const {getByText} = await renderWithQueryProvider(<Register />)

        expect(getByText('Loading...')).toBeInTheDocument()
    })

    it('defaults to "Choose your timezone..." option', async () => {
        loadTimezones()

        const {getByText} = await renderWithQueryProvider(<Register />)

        await waitFor(() => expect(getByText('Choose your timezone...')).toBeInTheDocument())
    })

    // TODO: switch to using input molecule
    // TODO: test validates timezone field
    // TODO: manually test full registration flow
    // TODO: stop toasting validation errors; print, instead
})
