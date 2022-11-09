import browser from './Browser';
import { sortTasks } from './sortTasks';

function makeTitle(task: TaskType) {
	return browser.getString(new Date(task.due));
}

const isNewTask = (t: TaskType, n: TaskType | undefined): boolean => {
	return (
		!!t && !!n && t.due === n.due && t.task === n.task && t.cents === n.cents
	);
};

type Entries = (TaskType | string)[];

type Options = {
	tasks: TaskType[];
	newTask?: TaskType;
	minDue?: Date;
	maxDue?: Date;
	reverse?: boolean;
};

export default function createListItems({
	tasks,
	newTask,
	minDue,
	maxDue,
	reverse,
}: Options): {
	entries: Entries;
	newTaskIndex: number | undefined;
} {
	const sortedTasks = sortTasks(tasks);

	if (reverse) {
		sortedTasks.reverse();
	}

	let lastTitle: string;
	let newTaskIndex: number | undefined = undefined;

	const entries = sortedTasks.reduce((acc: Entries, t: TaskType): Entries => {
		if (minDue && new Date(t.due) < minDue) return acc;
		if (maxDue && new Date(t.due) > maxDue) return acc;

		const title = makeTitle(t);
		const shouldAddHeading = title !== lastTitle || !acc.length;

		if (isNewTask(t, newTask)) {
			newTaskIndex = shouldAddHeading ? acc.length + 1 : acc.length;
		}

		if (shouldAddHeading) {
			lastTitle = title;
			return [...acc, title, t];
		}

		return [...acc, t];
	}, []);

	return {
		entries,
		newTaskIndex,
	};
}
