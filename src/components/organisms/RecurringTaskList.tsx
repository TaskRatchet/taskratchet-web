import React from 'react';
import ReactList from 'react-list';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import getRecurringTasks from '../../lib/api/getRecurringTasks';
import { useQuery } from 'react-query';
import TaskMenu from '../molecules/TaskMenu';
import RecurringTaskEdit from '../organisms/RecurringTaskEdit';

export default function RecurringTaskList(): JSX.Element {
	const { data = [] } = useQuery(['recurringTasks'], getRecurringTasks);
	return (
		<List>
			<ReactList
				length={data.length}
				itemRenderer={(i: number) => {
					const t = data[i];
					return (
						<ListItem
							key={t.id}
							secondaryAction={
								<TaskMenu
									renderItems={(handleClose: () => void) => {
										return [
											<RecurringTaskEdit
												key="edit"
												recurringTask={t}
												onOpen={() => handleClose()}
											/>,
										];
									}}
								/>
							}
						>
							{t.task}
						</ListItem>
					);
				}}
			/>
		</List>
	);
}
