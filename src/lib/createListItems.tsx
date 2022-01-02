import browser from './Browser';
import flattenObject from './flattenObject';

export function makeTitle(task: TaskType): string {
	return browser.getString(new Date(task.due));
}

const isNewTask = (t: TaskType, n: TaskType | undefined): boolean => {
	return (
		!!t && !!n && t.due === n.due && t.task === n.task && t.cents === n.cents
	);
};

export type Entries = Record<string, TaskType[]>;

export default function createListItems(
	sortedTasks: TaskType[],
	newTask: TaskType | undefined
): {
	entries: Entries;
	nextHeadingIndex: number | undefined;
	newTaskIndex: number | undefined;
} {
	const now = browser.getNow();
	let nextHeadingIndex: number | undefined;
	let newTaskIndex: number | undefined;

	const entries = sortedTasks.reduce((acc: Entries, t: TaskType): Entries => {
		const title = makeTitle(t);

		if (nextHeadingIndex === undefined && new Date(t.due) > now) {
			nextHeadingIndex = flattenObject(acc).length;
		}

		const updated = {
			...acc,
			[title]: [...(acc[title] || []), t],
		};

		if (isNewTask(t, newTask)) {
			newTaskIndex = flattenObject(updated).length - 1;
		}

		return updated;
	}, {});

	return {
		entries,
		nextHeadingIndex,
		newTaskIndex,
	};
}
