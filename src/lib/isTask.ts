export default function isTask(value: unknown): value is TaskType {
	return Object.prototype.hasOwnProperty.call(value || {}, 'task');
}
