export default async function updateRecurringTask(
	input: RecurringTaskInput & { id: string }
): Promise<void> {
	console.log(input);

	return Promise.resolve();
}
