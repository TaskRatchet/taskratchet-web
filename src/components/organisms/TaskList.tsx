import React, {useState} from "react";
import Task from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import {useSetComplete} from "../../lib/api/useSetComplete";

const TaskList = () => {
    const {data: tasks} = useTasks();

    const setComplete = useSetComplete()

    const [showArchive, setShowArchive] = useState<boolean>(false)

    const getSortedTasks = () => {
        if (!tasks) return []

        return sortTasks(tasks);
    };

    const getActiveTasks = () => {
        return getSortedTasks().filter((t: TaskType) => {
            return !t.complete && !t.charge_captured;
        });
    };

    const getArchivedTasks = () => {
        return getSortedTasks().filter((t: TaskType) => {
            return t.complete || t.charge_captured;
        });
    };

    const makeTaskListItems = (tasks: TaskType[]) => {
        return tasks.map((t, i) => {
            return <li key={i}><Task task={t} onToggle={setComplete}/></li>}
        );
    };

    return <>
        <ul className={'page-tasks__list'}>{makeTaskListItems(getActiveTasks())}</ul>

        <button className={'page-tasks__toggleLabel'} onClick={() => setShowArchive(!showArchive)}>Archived Tasks</button>

        {showArchive && <ul className={'page-tasks__list page-tasks__archive'}>{makeTaskListItems(getArchivedTasks())}</ul>}
    </>
}

export default TaskList
