import createLoginMachine, {LoginContext} from './Login.machine'
import api, {LegacyApi} from "../../lib/LegacyApi";
import {interpret, Interpreter} from "xstate";

let service: Interpreter<LoginContext>, mockApi: LegacyApi;

const createService = () => {
    const machine = createLoginMachine({ api: mockApi });
    const service = interpret(machine);

    service.start();

    return service;
}

const createMockApi = () => {
    const mockApi = api;

    mockApi.login = jest.fn();

    return mockApi
}

describe('login machine', () => {
    service = createService()
    mockApi = createMockApi()

    beforeEach(() => {
        service = createService()
        mockApi = createMockApi()
    })

    it('tracks email state', () => {
        service.send('EMAIL', {value: 'new_email'})

        expect(service.state.context.email).toBe('new_email')
    })

    it('sends login request', () => {
        service.start();

        service.send('EMAIL', {value: 'the_email'})
        service.send('PASSWORD', {value: 'the_password'})
        service.send('LOGIN')

        expect(mockApi.login).toBeCalled()
    })
})
