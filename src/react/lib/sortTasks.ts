function compareDate(a: TaskType, b: TaskType): number {
	if (a.due < b.due) return 1;
	if (a.due > b.due) return -1;
	return 0;
}

function compareCents(a: TaskType, b: TaskType): number {
	return b.cents - a.cents;
}

function compareAlphabet(a: TaskType, b: TaskType): number {
	return a.task.localeCompare(b.task);
}

const compareTasks = (a: TaskType, b: TaskType): number => {
	return compareDate(a, b) || compareCents(a, b) || compareAlphabet(a, b);
};

export function sortTasks(tasks: TaskType[]): TaskType[] {
	return tasks.sort(compareTasks);
}
