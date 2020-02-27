import React, {useState, useEffect} from 'react';
import Api from '../../../classes/Api';
import './style.css'
import Task from '../../molecules/Task'
import Toaster from "../../../classes/Toaster";

const Tasks = (props: {}) => {
    const [tasks, setTasks] = useState<Task[]>([]),
        [newTask, setNewTask] = useState<string>(''),
        [newDue, setNewDue] = useState<string>(''),
        [newCents, setNewCents] = useState<number>(500);

    const api: Api = new Api(),
        toaster: Toaster = new Toaster();

    useEffect(() => {
        setNewDue(getDefaultDue());
        updateTasks();
    }, []);

    const updateTasks = () => {
        api.getTasks()
            .then((res: any) => res.json())
            .then(setTasks)
    };

    const saveTask = (event: any) => {
        event.preventDefault();

        if (!newTask) {
            toaster.send('Missing task description');
            return;
        }

        toaster.send('Adding task...');

        const unixDue = Math.floor((new Date(newDue)).getTime() / 1000);

        setTasks((prev) => [...prev, {
            complete: false,
            due: unixDue,
            id: -1,
            cents: newCents,
            task: newTask,
            charge_authorized: null,
            charge_locked: null,
            charge_captured: null,
        }]);

        setNewDue(getDefaultDue());
        setNewCents(500);
        setNewTask('');

        api.addTask(newTask, unixDue, newCents).then((res: any) => {
            toaster.send((res.ok) ? 'Task added' : 'Failed to add task');
            updateTasks();
        });
    };

    const getDefaultDue = () => {
        const week = 1000 * 60 * 60 * 24 * 7,
            offset = (new Date()).getTimezoneOffset() * 60 * 1000,
            theDate = new Date(Date.now() + week - offset),
            dateString = theDate.toISOString().slice(0, 10);

        return dateString + 'T23:59:59';
    };

    const toggleStatus = (task: Task) => {
        setTasks((prev: Task[]) => {
            return prev.map((t: Task) => {
                if (t.id === task.id) t.complete = !t.complete;
                return t;
            });
        });

        api.setComplete(task.id, !task.complete).then((res: any) => {
            if (!res.ok) {
                toaster.send('Failed to mark task complete')
            }
            updateTasks()
        });
    };

    const compareTasks = (a: Task, b: Task) => {
        if (a.due < b.due) return -1;
        if (a.due > b.due) return 1;
        return 0;
    };

    const getSortedTasks = () => {
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
        return tasks.map(t => <li key={t.id}><Task task={t} onToggle={() => toggleStatus(t)}/></li>);
    };

    return <div className={'page-tasks'}>
        <h1>Tasks</h1>

        <form onSubmit={saveTask}>
            <div className="page-tasks__inputs">
                <label className={'page-tasks__description'}>Task <input
                    type="text"
                    placeholder={'Task'}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                /></label>
                <label className={'page-tasks__due'}>Due <input
                    type="datetime-local"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                /></label>
                <label className={'page-tasks__dollars'}>Stakes <input
                    type="number"
                    placeholder={'USD'}
                    min={1}
                    value={newCents / 100}
                    onChange={(e: any) => setNewCents(e.target.value * 100)}
                /></label>
            </div>
            <input className={'page-tasks__addButton'} type="submit" value={'Add'}/>
        </form>

        <ul className={'page-tasks__list'}>{makeTaskListItems(getActiveTasks())}</ul>

        <label htmlFor="archive_toggle" className={'page-tasks__toggleLabel'}>Archived Tasks</label>
        <input type="checkbox" className={'page-tasks__toggleInput'} id="archive_toggle"/>

        <ul className={'page-tasks__list page-tasks__archive'}>{makeTaskListItems(getArchivedTasks())}</ul>
    </div>
};

export default Tasks;