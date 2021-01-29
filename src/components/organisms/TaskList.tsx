import React from "react";
import Task from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import './TaskList.css'

const TaskList = () => {
    const {data: tasks} = useTasks();

    // TODO: use _.groupBy to group tasks under heading by due date
    // https://lodash.com/docs/4.17.15#groupBy

    const makeEntries = () => {
        const _tasks = sortTasks(tasks || [])
        return _tasks.map((t, i) => (
            <li key={i}><Task task={t} /></li>
        ));
    };

    return <ul className={'organism-taskList'}>
        {makeEntries()}
    </ul>
}

export default TaskList
