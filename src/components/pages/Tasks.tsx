import React, {useState} from 'react';
import './Tasks.css'
import Task from '../molecules/Task'
import 'react-datepicker/dist/react-datepicker.min.css'
import FreeEntry from "../organisms/FreeEntry";
import {useMe, useTasks} from "../../lib/api";
import {useSetComplete} from "../../lib/api/useSetComplete";
import _ from "lodash";
import {useAddTask} from "../../lib/api/useAddTask";
import {useBeforeunload} from "react-beforeunload";
import {getUnloadMessage} from "../../lib/getUnloadMessage";

interface TasksProps {
}

// TODO: Break entry and list portions of this component into
//   sibling components to avoid list length affecting input
//   performance when lots of items in list(s)
const Tasks = (props: TasksProps) => {
    const {data: tasks, isLoading} = useTasks();
    // TODO: extract useTimezone hook
    const {me} = useMe()
    const timezone = _.get(me, 'timezone')
    const setComplete = useSetComplete()
    const addTask = useAddTask()
    const [task, setTask] = useState<string>('')
    const [due, setDue] = useState<Date | null>(null)
    const [cents, setCents] = useState<number | null>(null)
    const [error, setError] = useState<string>('')

    useBeforeunload(getUnloadMessage)

    // console.log({m: 'rendering', tasks})

    // TODO: Fix compare function
    const compareTasks = (a: Task, b: Task) => {
        const aDate = new Date(a.due),
            bDate = new Date(b.due);

        if (aDate < bDate) return -1;
        if (aDate > bDate) return 1;
        return 0;
    };

    const getSortedTasks = () => {
        if (!tasks) return []

        return tasks.sort(compareTasks);
    };

    const getActiveTasks = () => {
        return getSortedTasks().filter((t: Task) => {
            return !t.complete && !t.charge_captured;
        });
    };

    const getArchivedTasks = () => {
        return getSortedTasks().filter((t: Task) => {
            return t.complete || t.charge_captured;
        });
    };

    const makeTaskListItems = (tasks: Task[]) => {
        return tasks.map(t => <li key={t.id}><Task task={t} onToggle={setComplete}/></li>);
    };

    return <div className={`page-tasks ${isLoading ? "loading" : "idle"}`}>
        <h1>Tasks</h1>

        {/*<TaskForm*/}
        {/*    task={task}*/}
        {/*    due={due}*/}
        {/*    cents={cents}*/}
        {/*    timezone={timezone}*/}
        {/*    error={error}*/}
        {/*    onChange={(task: string, due: Date | null, cents: number | null) => {*/}
        {/*        send({type: 'SET_FORM', value: {task, due, cents}})*/}
        {/*    }}*/}
        {/*    onSubmit={() => {*/}
        {/*        send("SAVE_TASK")*/}
        {/*    }}*/}
        {/*/>*/}

        <FreeEntry
            task={task}
            due={due}
            cents={cents}
            timezone={timezone}
            error={error}
            onChange={(task: string, due: Date | null, cents: number | null) => {
                setTask(task)
                setDue(due)
                setCents(cents)
            }}
            onSubmit={() => {
                setError(task ? '' : 'Task is required')
                if (!due || !cents) {
                    return
                }
                const dueString = due.toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                });
                addTask(task, dueString, cents)
                setTask('')
                setDue(null)
                setCents(null)
            }}
        />

        <ul className={'page-tasks__list'}>{makeTaskListItems(getActiveTasks())}</ul>

        <label htmlFor="archive_toggle" className={'page-tasks__toggleLabel'}>Archived Tasks</label>
        <input type="checkbox" className={'page-tasks__toggleInput'} id="archive_toggle"/>

        <ul className={'page-tasks__list page-tasks__archive'}>{makeTaskListItems(getArchivedTasks())}</ul>
    </div>
};

export default Tasks;
