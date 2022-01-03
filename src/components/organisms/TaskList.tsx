import React, { useEffect, useRef, useState } from 'react';
import { sortTasks } from '../../lib/sortTasks';
import { useTasks } from '../../lib/api';
import './TaskList.css';
import createListItems, { Entries } from '../../lib/createListItems';
import ReactList from 'react-list';
import Task from '../molecules/Task';
import { ListSubheader } from '@mui/material';
import flattenObject from '../../lib/flattenObject';

interface TaskListProps {
	lastToday?: Date;
	newTask?: TaskType;
	filters?: Filters;
}

function isTask(value: unknown): value is TaskType {
	return Object.prototype.hasOwnProperty.call(value, 'task');
}

function getEntryAtIndex(i: number, entries: Entries): string | TaskType {
	return flattenObject(entries)[i] as string | TaskType;
}

const TaskList = ({
	lastToday,
	newTask,
	filters,
}: TaskListProps): JSX.Element => {
	const { data: tasks } = useTasks();
	const listRef = useRef<ReactList>(null);
	const [entries, setEntries] = useState<Entries>();
	const [length, setLength] = useState<number>();
	const [nextHeadingIndex, setNextHeadingIndex] = useState<number>();
	const [newTaskIndex, setNewTaskIndex] = useState<number>();
	const [index, setIndex] = useState<number>(0);

	useEffect(() => {
		const sorted = sortTasks(tasks || []);
		const filtered = filters ? sorted.filter((t) => filters[t.status]) : sorted;

		const {
			entries: newEntries,
			nextHeadingIndex: headingIndexUpdate,
			newTaskIndex: taskIndexUpdate,
		} = createListItems(filtered, newTask);

		setEntries(newEntries);
		setLength(flattenObject(newEntries).length);
		setNextHeadingIndex(headingIndexUpdate);
		setNewTaskIndex(taskIndexUpdate);
	}, [tasks, newTask, filters]);

	useEffect(() => {
		if (listRef.current === null || nextHeadingIndex === undefined) return;
		listRef.current.scrollTo(nextHeadingIndex);
		setIndex(nextHeadingIndex);
	}, [entries, nextHeadingIndex, listRef, lastToday]);

	useEffect(() => {
		if (listRef.current === null || newTaskIndex === undefined) return;
		listRef.current.scrollTo(newTaskIndex);
		setIndex(newTaskIndex);
	}, [newTaskIndex, listRef]);

	return (
		<div className={'organism-taskList'}>
			{entries && (
				<ReactList
					initialIndex={index}
					itemRenderer={(i: number): JSX.Element => {
						const entry = getEntryAtIndex(i, entries);
						return isTask(entry) ? (
							<Task key={JSON.stringify(entry)} task={entry} />
						) : (
							<ListSubheader key={entry} disableSticky>
								{entry}
							</ListSubheader>
						);
					}}
					itemSizeEstimator={(i): number => {
						const entry = getEntryAtIndex(i, entries);
						return isTask(entry) ? 60 : 48;
					}}
					length={length}
					type={'variable'}
					ref={listRef}
				/>
			)}
		</div>
	);
};

export default TaskList;
