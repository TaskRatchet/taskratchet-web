import createManageEmailMachine, {Context} from './machine'
import api from "../../../classes/Api";
import {interpret, Interpreter} from "xstate";

let service: Interpreter<Context>;

const createService = (queryParams: object = {}) => {
    const machine = createManageEmailMachine({queryParams});
    const service = interpret(machine);

    service.start();

    return service;
}

describe('manage email machine', () => {
    api.getSubs = jest.fn()
    service = createService()

    beforeEach(() => {
        service = createService()
    })

    it('gets subs', () => {
        expect(api.getSubs).toBeCalled()
    })

    it('uses token to get subs', () => {
        service = createService({t: 'token'})

        expect(api.getSubs).toBeCalledWith('token')
    })

    it('stores subs', () => {
        const data = {'summaries': true},
            jsonResponse = JSON.stringify(data),
            machine = createManageEmailMachine();

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(jsonResponse))

        interpret(machine).onTransition((state) => {
            if (state.matches('idle')) {
                expect(state.context.subs).toBe(data)
            }
        }).start()

        expect.assertions(1)
    })

    it('unsubscribes if list param present', () => {
        service = createService({t: 'the_token', list: 'the_list'})

        expect(service.state.value).toBe('unsubscribing')
    })
})