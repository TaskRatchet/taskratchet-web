import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { sortTasks } from '../../lib/sortTasks';
import { useTasks } from '../../lib/api';
import './TaskList.css';
import AutoSizer, { Size } from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import createListItems from '../../lib/createListItems';
import useCellMeasurer from '../../lib/useCellMeasurer';

interface TaskListProps {
	lastToday?: Date;
	newTask?: TaskType;
}

const TaskList = ({ lastToday, newTask }: TaskListProps) => {
	const { data: tasks } = useTasks();
	const listRef = useRef<VariableSizeList>(null);
	const [entries, setEntries] = useState<JSX.Element[]>([]);
	const [nextHeadingIndex, setNextHeadingIndex] = useState<number>();
	const [newTaskIndex, setNewTaskIndex] = useState<number>();
	const [size, setSize] = useState<Size>();
	const cellMeasurerProps = useCellMeasurer({ items: entries, size });

	useEffect(() => {
		const sorted = sortTasks(tasks || []);

		const {
			entries: newEntries,
			nextHeadingIndex: headingIndexUpdate,
			newTaskIndex: taskIndexUpdate,
		} = createListItems(sorted, newTask);

		setEntries(newEntries);
		setNextHeadingIndex(headingIndexUpdate);
		setNewTaskIndex(taskIndexUpdate);
	}, [tasks, newTask]);

	useEffect(() => {
		if (listRef.current === null || nextHeadingIndex === undefined) return;
		listRef.current.scrollToItem(nextHeadingIndex, 'start');
	}, [nextHeadingIndex, listRef, lastToday]);

	useEffect(() => {
		if (listRef.current === null || newTaskIndex === undefined) return;
		listRef.current.scrollToItem(newTaskIndex);
	}, [newTaskIndex, listRef]);

	return (
		<div className={'organism-taskList'}>
			<AutoSizer onResize={(size) => setSize(size)}>
				{({ height, width }): ReactNode => (
					<VariableSizeList
						width={width}
						height={height}
						ref={listRef}
						{...cellMeasurerProps}
					>
						{({ index, style }) => <div style={style}>{entries[index]}</div>}
					</VariableSizeList>
				)}
			</AutoSizer>
		</div>
	);
};

export default TaskList;
