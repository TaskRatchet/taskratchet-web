import * as browser from './browser';

export default function useIsDue({ due_timestamp, status }: TaskType): boolean {
	if (due_timestamp === undefined) return false;
	if (status !== 'pending') return false;

	const due = due_timestamp * 1000;
	const now = browser.getNowTime();
	const diff = due - now;

	return diff >= 0 && diff < 24 * 60 * 60;
}
