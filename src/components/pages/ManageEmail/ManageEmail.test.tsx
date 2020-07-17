import createManageEmailMachine, {Context} from './machine'
import api from "../../../classes/Api";
import {interpret, Interpreter} from "xstate";

let service: Interpreter<Context>;

const createService = () => {
    const machine = createManageEmailMachine({ api: api });
    const service = interpret(machine);

    service.start();

    return service;
}

describe('login machine', () => {
    service = createService()

    beforeEach(() => {
        service = createService()
    })

    it('starts in init state', () => {
        expect(service.state.value).toBe('initial')
    })
})