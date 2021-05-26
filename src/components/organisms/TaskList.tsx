import React, {useEffect, useState} from "react";
import Task, {TaskProps} from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import './TaskList.css'
import _ from "lodash";
import browser from "../../lib/Browser";
import {Divider, List, ListItem, Typography} from "@material-ui/core";
import LazyList from "../molecules/LazyList";

const ListItemComponent = React.forwardRef((props: TaskProps, ref) => <Task ref_={ref} {...props} />)

interface TaskListProps {
    lastToday: Date|undefined
}

const TaskList = ({lastToday}: TaskListProps) => {
    const {data: tasks} = useTasks();
    const [didScroll, setDidScroll] = useState<boolean>(false)
    const todayRef = React.createRef<HTMLLIElement>()

    useEffect(() => {
        setDidScroll(false)
    }, [lastToday, setDidScroll])

    useEffect(() => {
        if (didScroll || !todayRef.current) return
        browser.scrollIntoView(todayRef.current)
        setDidScroll(true)
    }, [todayRef,didScroll,setDidScroll])

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
    const nextDuePretty = nextDue && browser.getString(new Date(nextDue))

    const divider = <li key={'today'} ref={todayRef} className={'organism-taskList__today'}>
        <Divider/>
        <Typography
            color="textSecondary"
            display="block"
            variant="caption"
        >
            {/*TODO: display ticking time, too*/}
            {`Today: ${todayString}`}
        </Typography>
    </li>

    const reducer = (prev: JSX.Element[] = [], s: string) => {
        const shouldShowBefore = s === nextDuePretty
        const shouldShowAfter = !nextDuePretty && s === dateStrings[dateStrings.length - 1]

        const item = <li key={s}>
            <h3>{s}</h3>
            {dateGroups[s].map((t: TaskType) => (
                <ListItem component={ListItemComponent} task={t} key={JSON.stringify(t)}/>
            ))}
        </li>

        if (shouldShowBefore) {
            return [...prev, divider, item]
        }

        if (shouldShowAfter) {
            return [...prev, item, divider]
        }

        return [...prev, item]
    };

    const entries = dateStrings.reduce(reducer, []);

    return <div className={'organism-taskList'}>
        <LazyList items={entries} />
    </div>
}

export default TaskList
