import queryString, { ParsedQuery } from 'query-string';

// https://htmldom.dev/get-the-first-scrollable-parent-of-an-element/
const isScrollable = function (el: Element) {
	const hasScrollableContent = el.scrollHeight > el.clientHeight;

	const overflowYStyle = window.getComputedStyle(el).overflowY;
	const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

	return hasScrollableContent && !isOverflowHidden;
};

const getScrollableParent = function (el: Element | null): Element {
	return !el || el === document.body
		? document.body
		: isScrollable(el)
		? el
		: getScrollableParent(el.parentElement);
};

export function getLanguages(): string[] {
	return navigator.languages.slice();
}

export function getDateTimeString(date: Date): string {
	const day = getDayName(date);
	const dateString = getDateString(date);
	const timeString = getTimeString(date);

	return `${day}, ${dateString}, ${timeString}`;
}

export function getDayName(date: Date): string {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	return days[date.getDay()];
}

export function getString(date: Date): string {
	return date.toLocaleString(getLanguages(), {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}

export function getDateString(date: Date): string {
	return date.toLocaleDateString(getLanguages());
}

export function getTimeString(date: Date): string {
	return date.toLocaleTimeString(getLanguages(), {
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function getNowDate(): Date {
	return new Date();
}

export function getNowTime(): number {
	return new Date().getTime();
}

export function getUrlParams(): ParsedQuery {
	return queryString.parse(window.location.search);
}

export function scrollIntoView(
	el: Element,
	options: { offset?: number } = {}
): void {
	const { offset = 0 } = options;
	const pos = el.getBoundingClientRect().top;
	const scrollableParent = getScrollableParent(el);

	scrollableParent.scrollTo({
		top: pos - offset,
	});
}

export function getScrollPercentage(el: Element): number {
	return el.scrollTop / (el.scrollHeight - el.clientHeight);
}
