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

const createResponse = ({ok = true, data = {}} = {}) => ({ok, json: async () => data})

const setApiResponse = (method: any, {ok = true, data = {}} = {}) => {
    const response = createResponse({ok, data});
    method.mockReturnValue(Promise.resolve(response));
}

const setGetSubsResponse = ({ok = true, data = {}} = {}) => {
    setApiResponse(api.getSubs, {ok, data})
}

const setRemoveSubResponse = ({ok = true, data = {}} = {}) => {
    setApiResponse(api.removeSub, {ok, data})
}

const setAddSubResponse = ({ok = true, data = {}} = {}) => {
    setApiResponse(api.addSub, {ok, data})
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

        setGetSubsResponse({data: {'summaries': true}})

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

        setRemoveSubResponse({data: {'summaries': true}})

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

        setGetSubsResponse({data: {'summaries': true}})

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

        setGetSubsResponse({data: {'summaries': true}})
        setAddSubResponse({data: {'summaries': true}})

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

        setGetSubsResponse()
        setAddSubResponse({data: {'summaries': true}})

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

        setGetSubsResponse({data: {'summaries': true}});
        setRemoveSubResponse({ok: false})

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

    it("sets error when failed subscribe", (done) => {
        const machine = createManageEmailMachine();

        let didSendEvent = false;

        setGetSubsResponse({data: {'summaries': true}});
        setAddSubResponse({ok: false})

        service = interpret(machine)

        service.onTransition(state => {
            if (state.matches('idle') && didSendEvent) {
                expect(state.context.error).toContain('Subscribe failed')
                done()
            }

            if (state.matches('idle') && !didSendEvent) {
                service.send('SUBSCRIBE', {value: 'the_list'})
                didSendEvent = true
            }
        }).start()

        expect.assertions(1)
    })

    it("sets error when failed to load", (done) => {
        const machine = createManageEmailMachine();

        setGetSubsResponse({ok: false})

        service = interpret(machine)

        service.onTransition(state => {
            if (state.matches('idle')) {
                expect(state.context.error).toContain('Failed to load subscriptions')
                done()
            }
        }).start()

        expect.assertions(1)
    })
})