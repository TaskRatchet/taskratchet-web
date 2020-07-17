import createManageEmailMachine, {Context} from './machine'
import api, {Api} from "../../../classes/Api";
import {interpret, Interpreter} from "xstate";

let service: Interpreter<Context>, mockApi: Api;

const createService = () => {
    const machine = createManageEmailMachine({ api: mockApi });
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

    it('starts in init state', () => {
        expect(service.state.value).toBe('initial')
    })
})