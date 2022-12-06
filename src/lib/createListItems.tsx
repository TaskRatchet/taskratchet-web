import * as browser from './browser';

function makeTitle(task: TaskType) {
	return browser.getString(new Date(task.due));
}

const isNewTask = (t: TaskType, n: TaskType | undefined): boolean => {
	return (
		!!t && !!n && t.due === n.due && t.task === n.task && t.cents === n.cents
	);
};

type Entries = (TaskType | string)[];

export default function createListItems(
	sortedTasks: TaskType[],
	newTask: TaskType | undefined
): {
	entries: Entries;
	nextHeadingIndex: number | undefined;
	newTaskIndex: number | undefined;
} {
	const now = browser.getNowDate();

	let lastTitle: string;
	let nextHeadingIndex: number | undefined = undefined;
	let newTaskIndex: number | undefined = undefined;

	const entries = sortedTasks.reduce((acc: Entries, t: TaskType): Entries => {
		const title = makeTitle(t);
		const shouldAddHeading = title !== lastTitle || !acc.length;

		if (isNewTask(t, newTask)) {
			newTaskIndex = shouldAddHeading ? acc.length + 1 : acc.length;
		}

		if (shouldAddHeading) {
			if (nextHeadingIndex === undefined && new Date(t.due) > now) {
				nextHeadingIndex = acc.length;
			}
			lastTitle = title;
			return [...acc, title, t];
		}

		return [...acc, t];
	}, []);

	return {
		entries,
		nextHeadingIndex,
		newTaskIndex,
	};
}
