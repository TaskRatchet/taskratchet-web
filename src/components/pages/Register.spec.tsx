import {loadCheckoutSession, loadTimezones, renderWithQueryProvider} from "../../lib/test/helpers";
import React from "react";
import Register from "./Register";
import {waitFor} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {getTimezones} from "../../lib/api";
import api from "../../lib/LegacyApi";

jest.mock('../../lib/api/getCheckoutSession')

describe('registration page', () => {
    beforeEach(() => {
        jest.resetAllMocks()
        loadCheckoutSession()
    })

    it('uses timezone loading placeholder', async () => {
        const {getByText} = await renderWithQueryProvider(<Register />)

        expect(getByText('Loading...')).toBeInTheDocument()
    })

    it('defaults to "Choose your timezone..." option', async () => {
        loadTimezones()

        const {getByText} = await renderWithQueryProvider(<Register />)

        await waitFor(() => expect(getByText('Choose your timezone...')).toBeInTheDocument())
    })

    it('uses Input for name field', async () => {
        const {getByLabelText} = await renderWithQueryProvider(<Register />)

        expect(getByLabelText('Name')).toBeInTheDocument()
    })

    it('uses Input for email field', async () => {
        const {getByLabelText} = await renderWithQueryProvider(<Register />)

        expect(getByLabelText('Email')).toBeInTheDocument()
    })

    it('uses Input for password field', async () => {
        const {getByLabelText} = await renderWithQueryProvider(<Register />)

        expect(getByLabelText('Password')).toBeInTheDocument()
    })

    it('uses Input for password2 field', async () => {
        const {getByLabelText} = await renderWithQueryProvider(<Register />)

        expect(getByLabelText('Retype Password')).toBeInTheDocument()
    })

    it('submits registration', async () => {
        loadTimezones(['the_timezone'])

        jest.spyOn(api, 'register')

        const {getByLabelText, getByText} = await renderWithQueryProvider(<Register />)

        userEvent.type(getByLabelText('Name'), 'the_name')
        userEvent.type(getByLabelText('Email'), 'the_email')
        userEvent.type(getByLabelText('Password'), 'the_password')
        userEvent.type(getByLabelText('Retype Password'), 'the_password')

        await waitFor(() => expect(getTimezones).toBeCalled())

        userEvent.selectOptions(getByLabelText('Timezone'), 'the_timezone')
        userEvent.click(getByLabelText('I have read and agree to TaskRatchet\'s privacy policy and terms of service.'))

        userEvent.click(getByText('Add payment method'))

        expect(api.register).toBeCalledWith(
            'the_name',
            'the_email',
            'the_password',
            'the_timezone',
            'session'
        )
    })

    // TODO: test validates timezone field
    // TODO: stop toasting validation errors; print, instead
})
