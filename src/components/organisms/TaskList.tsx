import React, {RefObject, useEffect, useState} from "react";
import Task, {TaskProps} from "../molecules/Task";
import {sortTasks} from "../../lib/sortTasks";
import {useTasks} from "../../lib/api";
import './TaskList.css'
import browser from "../../lib/Browser";
import {ListItem, ListSubheader} from "@material-ui/core";
import LazyList from "../molecules/LazyList";
import usePrevious from "../../lib/usePrevious";

function makeTitle(task: TaskType) {
    return browser.getString(new Date(task.due))
}

const ListItemComponent = React.forwardRef((props: TaskProps, ref) => <Task ref_={ref} {...props} />)


function createListItems(sortedTasks: TaskType[], previousTasks: TaskType[] | undefined, vals: {
    i: number,
    accumulator: JSX.Element[],
    lastAction: 'init' | 'title' | 'today' | 'task',
    nextHeadingRef: RefObject<HTMLLIElement>,
    nextHeadingFound: boolean,
    now: Date,
    focused: number[]
} = {
    i: 0,
    accumulator: [],
    lastAction: 'init',
    nextHeadingRef: React.createRef<HTMLLIElement>(),
    nextHeadingFound: false,
    now: browser.getNow(),
    focused: []
}): {
    entries: JSX.Element[],
    nextHeadingRef: RefObject<HTMLLIElement>,
    focused: number[]
} {
    const {
        i,
        accumulator,
        lastAction,
        nextHeadingRef,
        nextHeadingFound,
        now,
        focused
    } = vals

    const l = i > 0 ? sortedTasks[i - 1] : null
    const n = sortedTasks.length ? sortedTasks[i] : null

    if (lastAction !== 'title' && n && (l && makeTitle(l)) !== makeTitle(n)) {
        const lDue = l && new Date(l.due)
        const nDue = n && new Date(n.due)
        const headingsRemaining = Array.from(new Set(sortedTasks.slice(i).map(makeTitle)))
        const isAtTodayBoundary = (!lDue || lDue <= now) && (!nDue || nDue > now);
        const isLastHeading = headingsRemaining.length === 1;
        const shouldScrollToHeading = isAtTodayBoundary || (isLastHeading && !nextHeadingFound);

        const title = <ListSubheader
            key={`${headingsRemaining[0]}__heading`}
            className={shouldScrollToHeading ? 'organism-taskList__next' : ''}
            ref={shouldScrollToHeading ? nextHeadingRef : undefined}
        >{headingsRemaining[0]}</ListSubheader>

        return createListItems(sortedTasks, previousTasks, {
            ...vals,
            accumulator: [...accumulator,title],
            lastAction: 'title',
            focused: shouldScrollToHeading ? [...focused, accumulator.length] : focused,
            nextHeadingFound: shouldScrollToHeading || nextHeadingFound
        })
    }

    if (i < sortedTasks.length) {
        // WORKAROUND: https://github.com/mui-org/material-ui/issues/14971
        // TODO: Set a `highlight` and `scroll` bool on the `ListItem` component
        const item = <ListItem
            button={false as any}
            component={ListItemComponent as any}
            task={n}
            key={JSON.stringify(n)}
        />

        const updateHighlights = (
            n: TaskType | null,
            previousTasks: undefined | TaskType[],
            highlights: number[]
        ): number[] => {
            if (!n?.isNew) return highlights;
            return [...highlights, accumulator.length]
        }

        return createListItems(sortedTasks, previousTasks, {
            ...vals,
            accumulator: [...accumulator,item],
            lastAction: 'task',
            i: i + 1,
            focused: updateHighlights(n, previousTasks, focused)
        })
    }

    return {entries: accumulator, nextHeadingRef, focused}
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
        nextHeadingRef,
        focused
    } = createListItems(sorted, previousTasks)

    useEffect(() => {
        setDidScroll(false)
    }, [lastToday, setDidScroll])

    useEffect(() => {
        if (didScroll || !nextHeadingRef.current) return
        browser.scrollIntoView(nextHeadingRef.current)
        setDidScroll(true)
    }, [nextHeadingRef,didScroll,setDidScroll])

    return <div className={'organism-taskList'}>
        <LazyList items={entries} focused={focused} />
    </div>
}

export default TaskList
