import browser from './Browser';

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
	newTaskIndex: number | undefined;
} {
	const now = browser.getNowDate();
	const lastMidnight = browser.getLastMidnight(now);

	let lastTitle: string;
	let newTaskIndex: number | undefined = undefined;

	const entries = sortedTasks.reduce((acc: Entries, t: TaskType): Entries => {
		if (new Date(t.due) < lastMidnight) return acc;

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
