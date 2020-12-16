import React, {useState} from 'react';
import './Tasks.css'
import Task from '../molecules/Task'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'
import createTasksMachine from './Tasks.machine'
import {useMachine} from '@xstate/react';

const machine = createTasksMachine()

interface TasksProps {
}

const Tasks = (props: TasksProps) => {
    const [state, send] = useMachine(machine)
    const [showArchive, setShowArchive] = useState<boolean>(false)

    // TODO: Fix compare function
    const compareTasks = (a: Task, b: Task) => {
        const aDate = new Date(a.due),
            bDate = new Date(b.due);

        if (aDate < bDate) return -1;
        if (aDate > bDate) return 1;
        return 0;
    };

    const getSortedTasks = () => {
        return state.context.tasks.sort(compareTasks);
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
        return tasks.map(t => <li key={t.id}><Task task={t} onToggle={() => send({
            type: "TOGGLE_TASK",
            value: t.id
        })}/></li>);
    };

    return <div className={`page-tasks ${state.value === "idle" ? null : "loading"}`}>
        <h1>Tasks</h1>

        <form onSubmit={e => {
            e.preventDefault();
            send("SAVE_TASK")
        }}>
            <div className="page-tasks__inputs">
                {state.context.formError ? <p>{state.context.formError}</p> : null}

                <label className={'page-tasks__description'}>Task <input
                    type="text"
                    placeholder={'Task'}
                    value={state.context.task}
                    onChange={e => {
                        send({
                            type: 'SET_TASK',
                            value: e.target.value
                        })
                    }}
                /></label>
                <label className={'page-tasks__due'}>Due {state.context.timezone ? <>(<a href={'https://docs.taskratchet.com/timezones.html'} target={'_blank'} rel={"noopener noreferrer"}>{state.context.timezone}</a>)</> : null} <DatePicker
                    selected={state.context.due} onChange={value => send({type: 'SET_DUE', value})} showTimeSelect timeIntervals={5} dateFormat="MMMM d, yyyy h:mm aa" minDate={new Date()} /></label>
                <label className={'page-tasks__dollars'}>Stakes <input
                    type="number"
                    placeholder={'USD'}
                    min={1}
                    max={2500}
                    value={state.context.cents / 100}
                    onChange={e => send({
                        type: 'SET_CENTS',
                        value: parseInt(e.target.value) * 100
                    })}
                /></label>
            </div>
            <input className={'page-tasks__addButton'} type="submit" value={'Add'}/>
        </form>

        <ul className={'page-tasks__list'}>{makeTaskListItems(getActiveTasks())}</ul>

        <button className={'page-tasks__toggleLabel'} onClick={() => setShowArchive(!showArchive)}>Archived Tasks</button>

        {showArchive && <ul className={'page-tasks__list page-tasks__archive'}>{makeTaskListItems(getArchivedTasks())}</ul>}
    </div>
};

export default Tasks;
