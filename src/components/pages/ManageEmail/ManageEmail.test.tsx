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
        const machine = createManageEmailMachine();

        const response = {
            ok: true,
            json: async () => ({'summaries': true})
        };

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(response))

        interpret(machine).onTransition((state) => {
            if (state.matches('idle')) {
                expect(state.context.subs).toStrictEqual({'summaries': true})
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
        const machine = createManageEmailMachine({queryParams: {list: 'the_list'}});

        const removeSubResponse = {
            ok: true,
            json: async () => {
                return {'summaries': true}
            }
        };

        (api.removeSub as jest.Mock).mockReturnValue(Promise.resolve(removeSubResponse))

        interpret(machine).onTransition((state) => {
            if (state.matches('idle')) {
                expect(state.context.subs).toStrictEqual({'summaries': true})
                done()
            }
        }).start()

        expect.assertions(1)
    })

    it('accepts unsubscribe event', (done) => {
        const machine = createManageEmailMachine();

        let didSendEvent = false;

        const response = {
            ok: true,
            json: async () => ({'summaries': true})
        };

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(response))

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
        const machine = createManageEmailMachine();

        let didSendEvent = false;

        const response = {
            ok: true,
            json: async () => {
                return {'summaries': true}
            }
        };

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(response));
        (api.addSub as jest.Mock).mockReturnValue(Promise.resolve(response));

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
        const machine = createManageEmailMachine();

        let didSendEvent = false;

        const getSubsResponse = {
            ok: true,
            json: async () => {
                return {}
            }
        };
        const addSubResponse = {
            ok: true,
            json: async () => {
                return {'summaries': true}
            }
        };

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(getSubsResponse));
        (api.addSub as jest.Mock).mockReturnValue(Promise.resolve(addSubResponse));

        service = interpret(machine)

        service.onTransition((state) => {
            if (state.matches('idle') && didSendEvent) {
                expect(state.context.subs).toStrictEqual({'summaries': true})
                done()
            }

            if (state.matches('idle') && !didSendEvent) {
                service.send('SUBSCRIBE', {value: 'the_list'})
                didSendEvent = true
            }
        }).start()

        expect.assertions(1)
    })

    it("sets error when failed unsubscribe", (done) => {
        const machine = createManageEmailMachine();

        let didSendEvent = false;

        const getSubResponse = {
            ok: true,
            json: async () => {
                return {'summaries': true}
            }
        };

        const removeSubResponse = {
            ok: false,
        };

        (api.getSubs as jest.Mock).mockReturnValue(Promise.resolve(getSubResponse));
        (api.removeSub as jest.Mock).mockReturnValue(Promise.resolve(removeSubResponse))

        service = interpret(machine)

        service.onTransition(state => {
            if (state.matches('idle') && didSendEvent) {
                expect(state.context.error).toContain('Unsubscribe failed')
                done()
            }

            if (state.matches('idle') && !didSendEvent) {
                service.send('UNSUBSCRIBE', {value: 'the_list'})
                didSendEvent = true
            }
        }).start()

        expect.assertions(1)
    })
})