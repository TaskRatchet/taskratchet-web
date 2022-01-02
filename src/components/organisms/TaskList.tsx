import React, { useEffect, useRef, useState } from 'react';
import { sortTasks } from '../../lib/sortTasks';
import { useTasks } from '../../lib/api';
import './TaskList.css';
import createListItems from '../../lib/createListItems';
import ReactList from 'react-list';
import { ListSubheader, List } from '@mui/material';
import Task from '../molecules/Task';

interface TaskListProps {
	lastToday?: Date;
	newTask?: TaskType;
	filters?: Filters;
}

function isTask(value: unknown): value is TaskType {
	return Object.prototype.hasOwnProperty.call(value, 'task');
}

const TaskList = ({
	lastToday,
	newTask,
	filters,
}: TaskListProps): JSX.Element => {
	const { data: tasks } = useTasks();
	const listRef = useRef<ReactList>(null);
	const [entries, setEntries] = useState<(TaskType | string)[]>([]);
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
		setNextHeadingIndex(headingIndexUpdate);
		setNewTaskIndex(taskIndexUpdate);
	}, [tasks, newTask, filters]);

	useEffect(() => {
		if (listRef.current === null || nextHeadingIndex === undefined) return;
		listRef.current.scrollTo(nextHeadingIndex);
		setIndex(nextHeadingIndex);
	}, [nextHeadingIndex, listRef, lastToday]);

	useEffect(() => {
		if (listRef.current === null || newTaskIndex === undefined) return;
		listRef.current.scrollTo(newTaskIndex);
		setIndex(newTaskIndex);
	}, [newTaskIndex, listRef]);

	return (
		<div className={'organism-taskList'}>
			<ReactList
				initialIndex={index}
				itemRenderer={(i: number) => {
					const entry = entries[i];
					return isTask(entry) ? (
						<Task key={`${entry.id}_${entry.task}`} task={entry} />
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
				itemsRenderer={(items, ref) => (
					<List
						dense
						component={({ children }) => <div ref={ref}>{children}</div>}
					>
						{items}
					</List>
				)}
				itemSizeEstimator={(i) => (isTask(entries[i]) ? 60 : 48)}
				length={entries.length}
				type={'variable'}
				ref={listRef}
				threshold={800}
			/>
		</div>
	);
};

export default TaskList;
