import React from 'react';
import './Tasks.css'
import Task from '../molecules/Task'
import 'react-datepicker/dist/react-datepicker.min.css'
import createTasksMachine from './Tasks.machine'
import {useMachine} from '@xstate/react';
import FreeEntry from "../organisms/FreeEntry";
import {useMe, useTasks} from "../../lib/api";
import {useSetComplete} from "../../lib/api/useSetComplete";

const machine = createTasksMachine()

interface TasksProps {
}

const Tasks = (props: TasksProps) => {
    const [state, send] = useMachine(machine);
    const {data: tasks} = useTasks();
    const {me} = useMe()
    const setComplete = useSetComplete()

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

    return <div className={`page-tasks ${state.value === "idle" ? null : "loading"}`}>
        <h1>Tasks</h1>

        {/*<TaskForm*/}
        {/*    task={state.context.task}*/}
        {/*    due={state.context.due}*/}
        {/*    cents={state.context.cents}*/}
        {/*    timezone={state.context.timezone}*/}
        {/*    error={state.context.formError}*/}
        {/*    onChange={(task: string, due: Date | null, cents: number | null) => {*/}
        {/*        send({type: 'SET_FORM', value: {task, due, cents}})*/}
        {/*    }}*/}
        {/*    onSubmit={() => {*/}
        {/*        send("SAVE_TASK")*/}
        {/*    }}*/}
        {/*/>*/}

        <FreeEntry
            task={state.context.task}
            due={state.context.due}
            cents={state.context.cents}
            timezone={me ? me.timezone : null}
            error={state.context.formError}
            onChange={(task: string, due: Date | null, cents: number | null) => {
                // console.log({m: 'change handler', task, due, cents})
                send({type: 'SET_FORM', value: {task, due, cents}})
            }}
            onSubmit={() => {
                send("SAVE_TASK")
            }}
        />

        <ul className={'page-tasks__list'}>{makeTaskListItems(getActiveTasks())}</ul>

        <label htmlFor="archive_toggle" className={'page-tasks__toggleLabel'}>Archived Tasks</label>
        <input type="checkbox" className={'page-tasks__toggleInput'} id="archive_toggle"/>

        <ul className={'page-tasks__list page-tasks__archive'}>{makeTaskListItems(getArchivedTasks())}</ul>
    </div>
};

export default Tasks;
