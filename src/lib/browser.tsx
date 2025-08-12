import queryString, { type ParsedQuery } from 'query-string';

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

function getLanguages(): string[] {
	return navigator.languages.slice();
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
