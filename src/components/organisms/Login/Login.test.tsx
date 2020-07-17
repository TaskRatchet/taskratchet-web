import createLoginMachine, {LoginContext} from './machine'
import api from "../../../classes/Api";
import {interpret, Interpreter} from "xstate";

let service: Interpreter<LoginContext>;

const createService = () => {
    const machine = createLoginMachine({ api: api });
    const service = interpret(machine);

    service.start();

    return service;
}

describe('login machine', () => {
    service = createService()

    beforeEach(() => {
        service = createService()
    })

    it('tracks email state', () => {
        service.send('EMAIL', {value: 'new_email'})

        expect(service.state.context.email).toBe('new_email')
    })

    it('sends login request', () => {
        api.login = jest.fn();

        service.send('EMAIL', {value: 'the_email'})
        service.send('PASSWORD', {value: 'the_password'})
        service.send('LOGIN')

        expect(api.login).toBeCalled()
    })
})