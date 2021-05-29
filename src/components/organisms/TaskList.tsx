import React, {RefObject, useEffect, useState} from "react";
import Task, {TaskProps} from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import './TaskList.css'
import browser from "../../lib/Browser";
import {Divider, ListItem, ListSubheader, Typography} from "@material-ui/core";
import LazyList from "../molecules/LazyList";
import usePrevious from "../../lib/usePrevious";
import _ from "lodash";

function makeTitle(task: TaskType) {
    return browser.getString(new Date(task.due))
}

const ListItemComponent = React.forwardRef((props: TaskProps, ref) => <Task ref_={ref} {...props} />)


function createListItems(sortedTasks: TaskType[], previousTasks: TaskType[] | undefined, vals: {
    i: number,
    accumulator: JSX.Element[],
    lastAction: 'init' | 'title' | 'today' | 'task',
    todayRef: RefObject<HTMLLIElement>,
    todayIndex?: number,
    now: Date,
    highlights: number[]
} = {
    i: 0,
    accumulator: [],
    lastAction: 'init',
    todayRef: React.createRef<HTMLLIElement>(),
    now: browser.getNow(),
    highlights: []
}): {
    entries: JSX.Element[],
    todayRef: RefObject<HTMLLIElement>,
    todayIndex?: number,
    highlights: number[]
} {
    const {
        i,
        accumulator,
        lastAction,
        todayRef,
        todayIndex,
        now,
        highlights
    } = vals

    const l = i > 0 ? sortedTasks[i - 1] : null
    const n = sortedTasks.length ? sortedTasks[i] : null

    const lDue = l && new Date(l.due)
    const nDue = n && new Date(n.due)
    const isAtTodayBoundary = (!lDue || lDue <= now) && (!nDue || nDue > now);

    if (todayIndex === undefined && isAtTodayBoundary) {
        const marker = <li key={'today'} ref={todayRef} className={'organism-taskList__today'}>
            <Divider/>
            <Typography
                color="textSecondary"
                display="block"
                variant="caption"
            >
                {/*TODO: display ticking time, too*/}
                {`Today: ${browser.getString(now)}`}
            </Typography>
        </li>
        return createListItems(sortedTasks, previousTasks, {
            ...vals,
            accumulator: [...accumulator,marker],
            lastAction: 'today',
            todayIndex: accumulator.length
        })
    }

    if (lastAction !== 'title' && n && (l && makeTitle(l)) !== makeTitle(n)) {
        const s = makeTitle(n)
        const title = <ListSubheader key={`${s}__heading`}>{s}</ListSubheader>
        return createListItems(sortedTasks, previousTasks, {
            ...vals,
            accumulator: [...accumulator,title],
            lastAction: 'title',
        })
    }

    if (i < sortedTasks.length) {
        // WORKAROUND: https://github.com/mui-org/material-ui/issues/14971
        const item = <ListItem button={false as any} component={ListItemComponent as any} task={n} key={JSON.stringify(n)} />

        const updateHighlights = (
            n: TaskType | null,
            previousTasks: undefined | TaskType[],
            highlights: number[]
        ): number[] => {
            if (previousTasks === undefined) return [];
            const isInPrevious = previousTasks.some((t) => _.isEqual(n,t));
            if (!n || isInPrevious) return highlights;
            return [...highlights, accumulator.length]
        }

        return createListItems(sortedTasks, previousTasks, {
            ...vals,
            accumulator: [...accumulator,item],
            lastAction: 'task',
            i: i + 1,
            highlights: updateHighlights(n, previousTasks, highlights)
        })
    }

    return {entries: accumulator, todayRef, todayIndex, highlights}
}

interface TaskListProps {
    lastToday: Date|undefined
}

const TaskList = ({lastToday}: TaskListProps) => {
    const {data: tasks} = useTasks();
    const previousTasks: TaskType[] | undefined = usePrevious(tasks)
    const [didScroll, setDidScroll] = useState<boolean>(false)
    const sorted = sortTasks(tasks || [])

    const {
        entries,
        todayRef,
        todayIndex,
        highlights
    } = createListItems(sorted, previousTasks)

    useEffect(() => {
        setDidScroll(false)
    }, [lastToday, setDidScroll])

    useEffect(() => {
        if (didScroll || !todayRef.current) return
        browser.scrollIntoView(todayRef.current)
        setDidScroll(true)
    }, [todayRef,didScroll,setDidScroll])

    return <div className={'organism-taskList'}>
        <LazyList items={entries} initialIndex={todayIndex} highlights={highlights} />
    </div>
}

export default TaskList
