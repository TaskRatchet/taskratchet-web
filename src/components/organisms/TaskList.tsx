import React, {RefObject, useEffect, useState} from "react";
import Task, {TaskProps} from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import './TaskList.css'
import browser from "../../lib/Browser";
import {ListItem, ListSubheader} from "@material-ui/core";
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
    nextRef: RefObject<HTMLLIElement>,
    nextIndex?: number,
    now: Date,
    highlights: number[]
} = {
    i: 0,
    accumulator: [],
    lastAction: 'init',
    nextRef: React.createRef<HTMLLIElement>(),
    now: browser.getNow(),
    highlights: []
}): {
    entries: JSX.Element[],
    nextRef: RefObject<HTMLLIElement>,
    nextIndex?: number,
    highlights: number[]
} {
    const {
        i,
        accumulator,
        lastAction,
        nextRef,
        nextIndex,
        now,
        highlights
    } = vals

    const l = i > 0 ? sortedTasks[i - 1] : null
    const n = sortedTasks.length ? sortedTasks[i] : null

    if (lastAction !== 'title' && n && (l && makeTitle(l)) !== makeTitle(n)) {
        const lDue = l && new Date(l.due)
        const nDue = n && new Date(n.due)
        const headingsRemaining = sortedTasks.slice(i).map(makeTitle)
        const isAtTodayBoundary = (!lDue || lDue <= now) && (!nDue || nDue > now);
        const isLastHeading = headingsRemaining.length === 1;
        const shouldScrollToHeading = nextIndex === undefined && (isAtTodayBoundary || isLastHeading);

        const title = <ListSubheader
            key={`${headingsRemaining[0]}__heading`}
            className={shouldScrollToHeading ? 'organism-taskList__next' : ''}
            ref={shouldScrollToHeading ? nextRef : undefined}
        >{headingsRemaining[0]}</ListSubheader>

        return createListItems(sortedTasks, previousTasks, {
            ...vals,
            accumulator: [...accumulator,title],
            lastAction: 'title',
            nextIndex: shouldScrollToHeading ? accumulator.length : nextIndex
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

    return {entries: accumulator, nextRef, nextIndex, highlights}
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
        nextRef,
        nextIndex,
        highlights
    } = createListItems(sorted, previousTasks)

    useEffect(() => {
        setDidScroll(false)
    }, [lastToday, setDidScroll])

    useEffect(() => {
        if (didScroll || !nextRef.current) return
        browser.scrollIntoView(nextRef.current)
        setDidScroll(true)
    }, [nextRef,didScroll,setDidScroll])

    return <div className={'organism-taskList'}>
        <LazyList items={entries} initialIndex={nextIndex} highlights={highlights} />
    </div>
}

export default TaskList
