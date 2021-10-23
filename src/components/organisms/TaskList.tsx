import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { sortTasks } from '../../lib/sortTasks';
import { useTasks } from '../../lib/api';
import './TaskList.css';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import createListItems from '../../lib/createListItems';

interface TaskListProps {
	lastToday?: Date;
	newTask?: TaskType;
}

const TaskList = ({ lastToday, newTask }: TaskListProps) => {
	const { data: tasks } = useTasks();
	const listRef = useRef<VariableSizeList<any>>();
	const [entries, setEntries] = useState<JSX.Element[]>([]);
	const [nextHeadingIndex, setNextHeadingIndex] = useState<number>();
	const [newTaskIndex, setNewTaskIndex] = useState<number>();

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
		if (listRef.current === undefined || nextHeadingIndex === undefined) return;
		(listRef.current as any).scrollToItem(nextHeadingIndex, 'start');
	}, [nextHeadingIndex, listRef, lastToday]);

	useEffect(() => {
		if (listRef.current === undefined || newTaskIndex === undefined) return;
		(listRef.current as any).scrollToItem(newTaskIndex);
	}, [newTaskIndex, listRef]);

	return (
		<div className={'organism-taskList'}>
			<AutoSizer>
				{({ height, width }): ReactNode => (
					<VariableSizeList
						itemSize={() => 65}
						itemCount={entries.length}
						width={width}
						height={height}
						ref={listRef as any}
					>
						{({ index, style }) => <div style={style}>{entries[index]}</div>}
					</VariableSizeList>
				)}
			</AutoSizer>
		</div>
	);
};

export default TaskList;
