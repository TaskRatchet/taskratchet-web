import * as browser from './browser';

export default function useIsDue({ due, status }: TaskType): boolean {
	if (status !== 'pending') return false;

	const d = due * 1000;
	const now = browser.getNowTime();
	const diff = d - now;

	return diff >= 0 && diff < 24 * 60 * 60;
}
