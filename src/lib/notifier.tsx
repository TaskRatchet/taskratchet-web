import Api from './Api'
import moment from 'moment'
import notify from "./notifications";

// https://github.com/moment/moment/issues/348#issuecomment-629836811
moment.relativeTimeRounding((t) => {
    const DIGITS = 2; // like: 2.56 minutes
    return Math.round(t * Math.pow(10, DIGITS)) / Math.pow(10, DIGITS);
});
moment.relativeTimeThreshold('y', 365);
moment.relativeTimeThreshold('M', 12);
moment.relativeTimeThreshold('w', 4);
moment.relativeTimeThreshold('d', 31);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('ss', 0);

const sendNotification = async (dueInMs: number, task: Task) => {
    console.log('notifying')

    const response = await Api.getTask(task.id),
        _task = response ? await response.json() : false

    console.log(response)

    const isTaskComplete = response.ok && _task && _task.complete

    console.log(isTaskComplete)

    if (isTaskComplete) return

    const duration = moment.duration(dueInMs),
        dueString = duration.humanize(true),
        message = `Due ${dueString}: ${task.task}`

    console.log('about to notify')

    await notify(message)
};

const scheduleNotifications = async () => {
    console.log('hello')

    const response = await Api.getTasks()
    const tasks = response ? await response.json() : []

    console.log({response, tasks})

    tasks.map((t: Task) => {
        if (t.complete) return

        const due = Date.parse(t.due),
            now = Date.now(),
            dueInMs = due - now,
            delay = dueInMs / 2,
            minMs = 5 * 1000

        if (delay < minMs) return

        console.log('about to schedule')

        setTimeout(sendNotification, delay, dueInMs, t)
    })
}

export default scheduleNotifications
