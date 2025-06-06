export function makeTask({
	complete = false,
	due = new Date('5/22/2020, 11:59 PM').getTime() / 1000,
	id = Math.random().toString(),
	cents = 100,
	task = 'the_task',
	status = complete ? 'complete' : 'pending',
	isNew = undefined,
}: Partial<TaskType> = {}): TaskType {
	return {
		complete,
		due,
		id,
		cents,
		task,
		status,
		isNew,
	};
}
