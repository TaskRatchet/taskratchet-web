import browser from './Browser';
import React, { RefObject } from 'react';
import Task, { TaskProps } from '../components/molecules/Task';
import { ListItem, ListSubheader } from '@material-ui/core';

function makeTitle(task: TaskType) {
	return browser.getString(new Date(task.due));
}

const ListItemComponent = React.forwardRef((props: TaskProps, ref) => (
	<Task ref_={ref as RefObject<HTMLDivElement>} {...props} />
));
ListItemComponent.displayName = 'ListItemComponent';

export default function createListItems(
	sortedTasks: TaskType[],
	newTask: TaskType | undefined,
	vals: {
		i: number;
		accumulator: JSX.Element[];
		lastAction: 'init' | 'title' | 'today' | 'task';
		nextHeadingFound: boolean;
		now: Date;
		nextHeadingIndex?: number;
		newTaskIndex?: number;
	} = {
		i: 0,
		accumulator: [],
		lastAction: 'init',
		nextHeadingFound: false,
		now: browser.getNow(),
	}
): {
	entries: JSX.Element[];
	nextHeadingIndex: number | undefined;
	newTaskIndex: number | undefined;
} {
	const {
		i,
		accumulator,
		lastAction,
		nextHeadingFound,
		now,
		nextHeadingIndex,
		newTaskIndex,
	} = vals;

	const l = i > 0 ? sortedTasks[i - 1] : null;
	const n = sortedTasks.length ? sortedTasks[i] : null;

	if (lastAction !== 'title' && n && (l && makeTitle(l)) !== makeTitle(n)) {
		const lDue = l && new Date(l.due);
		const nDue = n && new Date(n.due);
		const headingsRemaining = Array.from(
			new Set(sortedTasks.slice(i).map(makeTitle))
		);
		const isAtTodayBoundary = (!lDue || lDue <= now) && (!nDue || nDue > now);
		const isLastHeading = headingsRemaining.length === 1;
		const shouldScrollToHeading =
			isAtTodayBoundary || (isLastHeading && !nextHeadingFound);
		const classes = `organism-taskList__heading ${
			shouldScrollToHeading && 'organism-taskList__next'
		}`;

		const title = (
			<ListSubheader
				key={`${headingsRemaining[0]}__heading`}
				className={classes}
				component={'div'}
				disableSticky={true}
			>
				{headingsRemaining[0]}
			</ListSubheader>
		);

		return createListItems(sortedTasks, newTask, {
			...vals,
			accumulator: [...accumulator, title],
			lastAction: 'title',
			nextHeadingIndex: shouldScrollToHeading
				? accumulator.length
				: nextHeadingIndex,
			nextHeadingFound: shouldScrollToHeading || nextHeadingFound,
		});
	}

	if (i < sortedTasks.length) {
		const item = (
			<ListItem
				component={ListItemComponent as any} // eslint-disable-line @typescript-eslint/no-explicit-any
				task={n}
				key={JSON.stringify(n)}
			/>
		);

		const updateScrollIndex = (
			t: TaskType | null,
			n: TaskType | undefined,
			scrollIndex: number | undefined
		): number | undefined => {
			if (!t || !n) return scrollIndex;
			if (t.due !== n.due || t.task !== n.task || t.cents !== n.cents)
				return scrollIndex;

			return accumulator.length;
		};

		return createListItems(sortedTasks, newTask, {
			...vals,
			accumulator: [...accumulator, item],
			lastAction: 'task',
			i: i + 1,
			newTaskIndex: updateScrollIndex(n, newTask, newTaskIndex),
		});
	}

	return { entries: accumulator, nextHeadingIndex, newTaskIndex };
}
