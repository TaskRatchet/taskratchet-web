import React from "react";
import Task, {TaskProps} from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import './TaskList.css'
import _ from "lodash";
import browser from "../../lib/Browser";
import {List, ListItem} from "@material-ui/core";

const ListItemComponent = React.forwardRef((props: TaskProps, ref) => <Task ref_={ref} {...props} />)

const TaskList = () => {
    const {data: tasks} = useTasks();

    const sorted = sortTasks(tasks || [])

    const dateGroups = _.groupBy(sorted, (t) => {
        return browser.getString(new Date(t.due))
    })

    return <div className={'organism-taskList'}>
        <List>
        {Object.keys(dateGroups).map((dateString: string) => (<div key={dateString}>
            <h3>{dateString}</h3>
            {dateGroups[dateString].map((t: TaskType) => (
                <ListItem component={ListItemComponent} task={t} key={JSON.stringify(t)} />
            ))}
        </div>)
        )}
        </List>
    </div>
}

export default TaskList
