import React, { useEffect, useRef, useState } from 'react';
import { sortTasks } from '../../lib/sortTasks';
import { useTasks } from '../../lib/api';
import './TaskList.css';
import createListItems from '../../lib/createListItems';
import ReactList from 'react-list';

interface TaskListProps {
	lastToday?: Date;
	newTask?: TaskType;
	filters?: Filters;
}

const TaskList = ({
	lastToday,
	newTask,
	filters,
}: TaskListProps): JSX.Element => {
	const { data: tasks } = useTasks();
	const listRef = useRef<ReactList>(null);
	const [entries, setEntries] = useState<JSX.Element[]>([]);
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
				itemRenderer={(i: number) => entries[i]}
				itemSizeEstimator={() => 60}
				length={entries.length}
				type={'variable'}
				ref={listRef}
			/>
		</div>
	);
};

export default TaskList;
