import React, {useState} from "react";
import Task from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";

const TaskList = () => {
    const {data: tasks} = useTasks();
    const [showArchive, setShowArchive] = useState<boolean>(false)

    const getSortedTasks = () => {
        if (!tasks) return []

        return sortTasks(tasks);
    };

    const getPendingTasks = () => {
        return getSortedTasks().filter((t: TaskType) => {
            return t.status === 'pending';
        });
    };

    const getArchivedTasks = () => {
        return getSortedTasks().filter((t: TaskType) => {
            return t.status !== 'pending';
        });
    };

    const makeTaskListItems = (tasks: TaskType[]) => {
        return tasks.map((t, i) => {
            return <li key={i}><Task task={t} /></li>}
        );
    };

    return <>
        <ul className={'page-tasks__list'}>{makeTaskListItems(getPendingTasks())}</ul>

        <button className={'page-tasks__toggleLabel'} onClick={() => setShowArchive(!showArchive)}>Archived Tasks</button>

        {showArchive && <ul className={'page-tasks__list page-tasks__archive'}>{makeTaskListItems(getArchivedTasks())}</ul>}
    </>
}

export default TaskList
