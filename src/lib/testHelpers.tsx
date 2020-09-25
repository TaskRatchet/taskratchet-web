import api from "./Api";

export const makeResponse = ({ok = true, json = ''} = {}) => {
    return Promise.resolve({ok, json: () => Promise.resolve(json)})
}

export const loadApiResponse = (
    mock: any,
    response: { json?: any, ok?: boolean } = {json: null, ok: true}
) => {
    (mock as jest.Mock).mockReturnValue(makeResponse(response))
}

export const loadApiTask = (taskOptions = {}) => {
    const task = makeTask(taskOptions)

    loadApiResponse(api.getTask, {json: task})
}

export const loadApiData = (
    {tasks = [], me = {}}: { tasks?: Task[], me?: object } = {}
) => {
    loadApiResponse(api.getTasks, {json: tasks || []});
    loadApiResponse(api.getMe, {json: me || {}});
    loadApiResponse(api.setComplete);
    loadApiResponse(api.addTask)
}

export interface MakeTaskArgs {
    complete?: boolean,
    due?: string,
    id?: number,
    cents?: number,
    task?: string,
    charge_locked?: number,
    charge_authorized?: number,
    charge_captured?: number
}

export const makeTask = (
    {
        complete = false,
        due = "5/22/2020, 11:59 PM",
        id = Math.random(),
        cents = 0,
        task = 'the_task',
        charge_locked = undefined,
        charge_authorized = undefined,
        charge_captured = undefined
    }: MakeTaskArgs = {}
): Task => {
    return {
        complete,
        due,
        id,
        cents,
        task,
        charge_locked,
        charge_authorized,
        charge_captured,
    }
}
