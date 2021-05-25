import React from "react";
import Task, {TaskProps} from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import './TaskList.css'
import _ from "lodash";
import browser from "../../lib/Browser";
import {Divider, List, ListItem, Typography} from "@material-ui/core";

const ListItemComponent = React.forwardRef((props: TaskProps, ref) => <Task ref_={ref} {...props} />)

const TaskList = () => {
    const {data: tasks} = useTasks();

    const sorted = sortTasks(tasks || [])
    const sortedDues = sorted.map((t) => t.due)
    const today = browser.getNow()
    const todayString = browser.getString(today)
    const futureDues = sortedDues.filter((d) => new Date(d) >= today)
    const dateGroups = _.groupBy(sorted, (t) => {
        return browser.getString(new Date(t.due))
    })
    const dateStrings = Object.keys(dateGroups);
    const nextDue = futureDues && futureDues[0]
    const nextDuePretty = browser.getString(new Date(nextDue))

    console.log({today, sortedDues, futureDues, nextDue})

    return <div className={'organism-taskList'}>
        <List>
            {dateStrings.map((s: string) => {

                    return <>
                        {s === nextDuePretty && <>
                            <Divider component="li" key={'today-divider'} className={'organism-taskList__todayDivider'} />
                            <li key={'today'} className={'organism-taskList__today'}>
                                <Typography
                                    color="textSecondary"
                                    display="block"
                                    variant="caption"
                                >
                                    {/*TODO: display ticking time, too*/}
                                    {`Today: ${todayString}`}
                                </Typography>
                            </li>
                        </>}
                        <li key={s}>
                            <h3>{s}</h3>
                            {dateGroups[s].map((t: TaskType) => (
                                <ListItem component={ListItemComponent} task={t} key={JSON.stringify(t)}/>
                            ))}
                        </li>
                    </>
                }
            )}
        </List>
    </div>
}

export default TaskList
