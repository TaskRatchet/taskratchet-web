import * as browser from './browser';
import humanizeDuration from 'humanize-duration';

const shortEnglishHumanizer = humanizeDuration.humanizer({
	language: 'shortEn',
	languages: {
		shortEn: {
			y: () => 'y',
			mo: () => 'mo',
			w: () => 'w',
			d: () => 'd',
			h: () => 'h',
			m: () => 'm',
			s: () => 's',
			ms: () => 'ms',
		},
	},
});

export default function useDifferenceToNow({
	due_timestamp,
}: TaskType): string {
	if (due_timestamp === undefined) return '';

	const due = due_timestamp * 1000;
	const now = browser.getNowTime();
	const diff = due - now;
	const s1 = shortEnglishHumanizer(diff, {
		largest: 2,
		round: true,
		spacer: '',
	});
	const s2 = s1.replace(/,/g, '');

	return diff < 0 ? `${s2} ago` : `in ${s2}`;
}
