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
    api.addSub = jest.fn()
    api.removeSub = jest.fn()
    service = createService()

    beforeEach(() => {
        jest.clearAllMocks()
        service = createService()
    })

    it('gets subs', () => {
        expect(api.getSubs).toBeCalled()
    })

    it('uses token to get subs', () => {
        service = createService({t: 'token'})

        expect(api.getSubs).toBeCalledWith('token')
    })

    it('stores subs', (done) => {
        const data = {'summaries': true},
            jsonResponse = JSON.stringify(data),
            machine = createManageEmailMachine();

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(jsonResponse))

        interpret(machine).onTransition((state) => {
            if (state.matches('idle')) {
                expect(state.context.subs).toStrictEqual(data)
                done()
            }
        }).start()

        expect.assertions(1)
    })

    it('unsubscribes if list param present', () => {
        service = createService({list: 'the_list'})

        expect(service.state.value).toBe('unsubscribing')
    })

    it('sends unsubscribe request', () => {
        createService({list: 'the_list'})

        expect(api.removeSub).toBeCalledWith('the_list', undefined)
    })

    it('stores subs on unsubscribe', (done) => {
        const data = {'summaries': true},
            jsonResponse = JSON.stringify(data),
            machine = createManageEmailMachine({queryParams: {list: 'the_list'}});

        (api.removeSub as jest.Mock).mockReturnValue(Promise.resolve(jsonResponse))

        interpret(machine).onTransition((state) => {
            if (state.matches('idle')) {
                expect(state.context.subs).toStrictEqual(data)
                done()
            }
        }).start()

        expect.assertions(1)
    })

    it('accepts unsubscribe event', (done) => {
        const data = {'summaries': true},
            jsonResponse = JSON.stringify(data),
            machine = createManageEmailMachine();

        let didSendEvent = false;

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(jsonResponse))

        service = interpret(machine)

        service.onTransition((state) => {
            if (state.matches('idle') && didSendEvent) {
                expect(api.removeSub).toBeCalledWith('the_list', undefined)
                done()
            }

            if (state.matches('idle') && !didSendEvent) {
                service.send('UNSUBSCRIBE', {value: 'the_list'})
                didSendEvent = true
            }
        }).start()

        expect.assertions(1)
    })

    it('accepts subscribe event', (done) => {
        const data = {'summaries': true},
            jsonResponse = JSON.stringify(data),
            machine = createManageEmailMachine();

        let didSendEvent = false;

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(jsonResponse));
        (api.addSub as jest.Mock).mockReturnValue(Promise.resolve(jsonResponse));

        service = interpret(machine)

        service.onTransition((state) => {
            if (state.matches('idle') && didSendEvent) {
                expect(api.addSub).toBeCalledWith('the_list', undefined)
                done()
            }

            if (state.matches('idle') && !didSendEvent) {
                service.send('SUBSCRIBE', {value: 'the_list'})
                didSendEvent = true
            }
        }).start()

        expect.assertions(1)
    })

    it('stores subs on subscribe', (done) => {
        const initData = {},
            initJsonResponse = JSON.stringify(initData),
            endData = {'summaries': true},
            endJsonResponse = JSON.stringify(endData),
            machine = createManageEmailMachine();

        let didSendEvent = false;

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(initJsonResponse));
        (api.addSub as jest.Mock).mockReturnValue(Promise.resolve(endJsonResponse));

        service = interpret(machine)

        service.onTransition((state) => {
            if (state.matches('idle') && didSendEvent) {
                expect(state.context.subs).toStrictEqual(endData)
                done()
            }

            if (state.matches('idle') && !didSendEvent) {
                service.send('SUBSCRIBE', {value: 'the_list'})
                didSendEvent = true
            }
        }).start()

        expect.assertions(1)
    })
})