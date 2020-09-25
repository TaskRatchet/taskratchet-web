import scheduleNotifications from './notifier'
import Api from './Api'
import {loadApiData, loadApiResponse, loadApiTask, makeTask, MakeTaskArgs} from "./testHelpers";
import mockNow from 'jest-mock-now'
import notify from './notifications'
import {waitFor} from "@testing-library/dom";

jest.mock('./Api')
jest.mock('./notifications')

function setTimes(due: string, now: string, taskOptions: MakeTaskArgs = {}) {
    loadApiData({tasks: [makeTask({
            due: due,
            task: 'the_task',
            ...taskOptions
    })]})
    mockNow(new Date(now))
}

describe('notifier', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    // it('gets tasks', async () => {
    //     await scheduleNotifications()
    //
    //     expect(Api.getTasks).toBeCalled()
    // })
    //
    // it('sets timer', async () => {
    //     jest.useFakeTimers()
    //
    //     setTimes("1/2/2020, 1:00 AM", "1/1/2020, 1:00 AM");
    //
    //     await scheduleNotifications()
    //
    //     expect(setTimeout).toHaveBeenCalled();
    // })
    //
    // it('sets timeout with zeno schedule', async () => {
    //     jest.useFakeTimers()
    //
    //     const dueString = "1/2/2020, 1:00 AM",
    //         nowString = "1/1/2020, 1:00 AM",
    //         dueMs = Date.parse(dueString),
    //         nowMs = Date.parse(nowString),
    //         delayMs = (dueMs - nowMs) / 2
    //
    //     setTimes(dueString, nowString);
    //
    //     await scheduleNotifications()
    //
    //     expect(setTimeout).toBeCalledWith(
    //         expect.any(Function),
    //         delayMs,
    //         expect.any(Number),
    //         expect.any(Object)
    //     )
    // })
    //
    // it('skips completed tasks', async () => {
    //     loadApiData({tasks: [makeTask({complete: true})]})
    //
    //     await scheduleNotifications()
    //
    //     expect(setTimeout).not.toHaveBeenCalled()
    // })
    //
    // it('notifies', async () => {
    //     jest.useFakeTimers()
    //
    //     loadApiTask()
    //     setTimes("1/2/2020, 1:00 AM", "1/1/2020, 1:00 AM");
    //
    //     await scheduleNotifications()
    //
    //     await jest.runOnlyPendingTimers()
    //
    //     await waitFor(() => expect(notify).toBeCalledWith("Due in a day: the_task"))
    // })
    //
    // it('does not notify if delay less than 5 seconds', async () => {
    //     jest.useFakeTimers()
    //
    //     setTimes("1/1/2020, 1:00:09 AM", "1/1/2020, 1:00 AM");
    //
    //     await scheduleNotifications()
    //
    //     expect(setTimeout).not.toHaveBeenCalled()
    // })

    it('gets task to notify when notifying', async () => {
        jest.useFakeTimers('modern')

        setTimes(
            "1/2/2020, 1:00 AM",
            "1/1/2020, 1:00 AM",
            {id: 3}
        );

        await scheduleNotifications()

        await jest.runOnlyPendingTimers()

        expect(Api.getTask).toBeCalledWith(3)
    })

    it('uses precise humanization', async () => {
        jest.useFakeTimers('modern')

        loadApiTask()
        setTimes("1/1/2020, 1:00:45 AM", "1/1/2020, 1:00 AM");

        await scheduleNotifications()

        await jest.runOnlyPendingTimers()

        await waitFor(() => expect(notify).toBeCalledWith("Due in 45 seconds: the_task"))
    })

    // it('aborts notification if task completed', async () => {
    //     jest.useFakeTimers()
    //
    //     loadApiTask({complete: true})
    //     setTimes("1/1/2020, 1:00:45 AM", "1/1/2020, 1:00 AM");
    //
    //     await scheduleNotifications()
    //
    //     await jest.runOnlyPendingTimers()
    //
    //     expect(notify).not.toHaveBeenCalled()
    // })
    //
    // it('continues to notify on 403 response', async () => {
    //     jest.useFakeTimers()
    //
    //     loadApiResponse(Api.getTask, {json: 'error', ok: false})
    //     setTimes("1/1/2020, 1:00:45 AM", "1/1/2020, 1:00 AM");
    //
    //     await scheduleNotifications()
    //
    //     await jest.runOnlyPendingTimers()
    //
    //     await waitFor(() => expect(notify).toBeCalled())
    // })
})
