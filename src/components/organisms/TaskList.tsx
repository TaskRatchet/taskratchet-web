import React, { RefObject, useEffect, useRef, useState } from 'react';
import { sortTasks } from '../../lib/sortTasks';
import { useTasks } from '../../lib/api';
import './TaskList.css';
import createListItems from '../../lib/createListItems';
import ReactList from 'react-list';
import { ListItem, ListSubheader } from '@mui/material';
import Task, { TaskProps } from '../molecules/Task';

interface TaskListProps {
	lastToday?: Date;
	newTask?: TaskType;
}

const ListItemComponent = React.forwardRef((props: TaskProps, ref) => (
	<Task ref_={ref as RefObject<HTMLDivElement>} {...props} />
));
ListItemComponent.displayName = 'ListItemComponent';

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
					const isTask = Object.prototype.hasOwnProperty.call(entry, 'task');
					return isTask ? (
						<ListItem
							component={ListItemComponent as any} // eslint-disable-line @typescript-eslint/no-explicit-any
							task={entry}
							key={JSON.stringify(entry)}
						/>
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
				itemSizeEstimator={() => 60}
				length={entries.length}
				type={'variable'}
				ref={listRef}
			/>
		</div>
	);
};

export default TaskList;
