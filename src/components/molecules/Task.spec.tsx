import Task from "./Task";
import React from "react";
import {renderWithQueryProvider, sleep} from "../../lib/test/helpers";
import userEvent from "@testing-library/user-event";
import {updateTask} from "../../lib/api";
import {waitFor} from "@testing-library/dom";

jest.mock('../../lib/api/updateTask')

describe('Task componet', () =>  {
    it('disables checkbox for tasks without id', async () => {
        const {container} = await renderWithQueryProvider(<Task task={{
            due: 'the_due',
            cents: 100,
            task: 'the_task'
        }} />)

        const checkbox = container.querySelector('input')

        expect(checkbox && checkbox.disabled).toBeTruthy()
    })

    it('has task menu', async () => {
        const {getByLabelText} = await renderWithQueryProvider(<Task task={{
            due: 'the_due',
            cents: 100,
            task: 'the_task',
            id: 'the_id'
        }} />)

        expect(getByLabelText('Menu')).toBeInTheDocument()
    })

    it('has uncle menu item', async () => {
        const {getByLabelText, getByText} = await renderWithQueryProvider(<Task task={{
            due: 'the_due',
            cents: 100,
            task: 'the_task',
            id: 'the_id'
        }} />)

        const menuButton = getByLabelText('Menu')

        userEvent.click(menuButton)

        expect(getByText('Charge immediately')).toBeInTheDocument()
    })

    it('uncles', async () => {
        const {getByLabelText, getByText} = await renderWithQueryProvider(<Task task={{
            due: 'the_due',
            cents: 100,
            task: 'the_task',
            id: 'the_id'
        }} />)

        userEvent.click(getByLabelText('Menu'))
        userEvent.click(getByText('Charge immediately'))

        await waitFor(() => expect(updateTask).toBeCalledWith('the_id', {
            'uncle': true
        }))
    })

    it('flags tasks as charging that have charge email sent', async () => {
        const {getByText} = await renderWithQueryProvider(<Task task={{
            due: 'the_due',
            cents: 100,
            task: 'the_task',
            id: 'the_id',
            charge_email_sent: true
        }} />)

        expect(getByText('Charging')).toBeInTheDocument()
    })

    // Punt

    // TODO: test uncle button is disabled if task already charging
    // TODO: test uncle button confirms action
})
