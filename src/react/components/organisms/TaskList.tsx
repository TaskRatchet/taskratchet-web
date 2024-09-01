import React, { useEffect, useRef, useState } from 'react';
import { sortTasks } from '../../lib/sortTasks';
import { useTasks } from '../../lib/api/useTasks';
import createListItems from '../../lib/createListItems';
import ReactList from 'react-list';
import { Alert, AlertTitle, ListSubheader } from '@mui/material';
import Task from '../molecules/Task';
import useFilters from '../../lib/useFilters';

interface TaskListProps {
	lastToday?: Date;
	newTask?: TaskType;
}

function isTask(value: unknown): value is TaskType {
	return Object.prototype.hasOwnProperty.call(value || {}, 'task');
}

const TaskList = ({ lastToday, newTask }: TaskListProps): JSX.Element => {
	const { data: tasks, isFetched } = useTasks();
	const { filters } = useFilters();
	const listRef = useRef<ReactList>(null);
	const [entries, setEntries] = useState<(TaskType | string)[]>([]);
	const [nextHeadingIndex, setNextHeadingIndex] = useState<number>();
	const [newTaskIndex, setNewTaskIndex] = useState<number>();
	const [index, setIndex] = useState<number>(0);
	const [shouldScroll, setShouldScroll] = useState<boolean>(false);

	useEffect(() => {
		const sorted = sortTasks(tasks || []);
		const filtered = filters ? sorted.filter((t) => filters[t.status]) : sorted;

		const {
			entries: newEntries,
			nextHeadingIndex: headingIndexUpdate,
			newTaskIndex: taskIndexUpdate,
		} = createListItems(filtered, newTask);

		setNextHeadingIndex(headingIndexUpdate);
		setEntries(newEntries);
		setNewTaskIndex(taskIndexUpdate);
	}, [tasks, newTask, filters, nextHeadingIndex]);

	useEffect(() => {
		if (nextHeadingIndex === undefined) return;
		setIndex(nextHeadingIndex);
		setShouldScroll(true);
	}, [nextHeadingIndex, isFetched, lastToday]);

	useEffect(() => {
		if (newTaskIndex === undefined) return;
		setIndex(newTaskIndex);
		setShouldScroll(true);
	}, [newTaskIndex]);

	useEffect(() => {
		if (!listRef.current || !shouldScroll) return;
		listRef.current.scrollTo(index);
		setShouldScroll(false);
	}, [index, shouldScroll]);

	return (
		<>
			{isFetched && !(tasks || []).length && (
				<Alert severity="info">
					<AlertTitle>Nothing here!</AlertTitle>
					Maybe add a task?
				</Alert>
			)}
			<ReactList
				initialIndex={index}
				itemRenderer={(i: number) => {
					const entry = entries[i];
					return isTask(entry) ? (
						<Task key={`${entry.id ?? ''}_${entry.task}`} task={entry} />
					) : (
						<ListSubheader
							key={`${entry}__heading`}
							className={`organism-taskList__heading`}
							component={'div'}
							disableSticky={true}
						>
							{entry}
						</ListSubheader>
					);
				}}
				itemSizeEstimator={(i) => (isTask(entries[i]) ? 60 : 48)}
				length={entries.length}
				type={'variable'}
				ref={listRef}
			/>
		</>
	);
};

export default TaskList;
