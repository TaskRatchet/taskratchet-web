import {assign, createMachine, StateMachine} from "xstate";
import live_api, { Api } from "../../../classes/Api";

export interface Context {
}

interface CreateMachineOptions {
    api?: Api
}

const createManageEmailMachine = (options: CreateMachineOptions = {}): StateMachine<Context, any, any> => {
    return createMachine({
        id: 'login',
        initial: 'initial',
        states: {
            initial: {

            },
        },
    })
}

export default createManageEmailMachine