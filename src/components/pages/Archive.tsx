import React, { useEffect, useRef, useState } from 'react';
import { useTasks } from '../../lib/api/useTasks';
import createListItems from '../../lib/createListItems';
import ReactList from 'react-list';
import { Alert, AlertTitle, ListSubheader } from '@mui/material';
import Task from '../molecules/Task';
import useFilters from '../../lib/useFilters';
import browser from '../../lib/Browser';
import isTask from '../../lib/isTask';

export default function Archive(): JSX.Element {
	const { data: tasks, isFetched } = useTasks();
	const { filters } = useFilters();
	const listRef = useRef<ReactList>(null);
	const [entries, setEntries] = useState<(TaskType | string)[]>([]);

	useEffect(() => {
		const filtered = filters
			? (tasks ?? []).filter((t) => filters[t.status])
			: tasks ?? [];

		const { entries: e } = createListItems({
			tasks: filtered,
			maxDue: browser.getLastMidnight(),
			reverse: true,
		});

		setEntries(e);
	}, [tasks, filters]);

	return (
		<>
			{isFetched && !(tasks || []).length && (
				<Alert severity="info">
					<AlertTitle>Nothing here!</AlertTitle>
					Maybe add a task?
				</Alert>
			)}
			<ReactList
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
}
