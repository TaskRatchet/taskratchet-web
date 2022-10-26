export function makeTask({
	complete = false,
	due = '5/22/2020, 11:59 PM',
	due_timestamp = undefined,
	id = Math.random().toString(),
	cents = 100,
	task = 'the_task',
	status = complete ? 'complete' : 'pending',
	isNew = undefined,
	timezone = 'Etc/GMT',
}: Partial<TaskType> = {}): TaskType {
	return {
		complete,
		due,
		due_timestamp,
		id,
		cents,
		task,
		status,
		isNew,
		timezone,
	};
}
