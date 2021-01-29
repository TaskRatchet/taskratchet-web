import React from "react";
import Task from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import './TaskList.css'
import _ from "lodash";
import browser from "../../lib/Browser";

const TaskList = () => {
    const {data: tasks} = useTasks();

    const sorted = sortTasks(tasks || [])

    const dateGroups = _.groupBy(sorted, (t) => {
        return browser.getString(new Date(t.due))
    })

    return <ul className={'organism-taskList'}>
        {Object.keys(dateGroups).map((dateString: string) => (<>
            <h3>{dateString}</h3>
            {dateGroups[dateString].map((t, i) => (
                <li key={i}><Task task={t}/></li>
            ))}
        </>)
        )}
    </ul>
}

export default TaskList
