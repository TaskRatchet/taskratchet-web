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

export class Browser {
	getLanguages(): string[] {
		return navigator.languages.slice();
	}

	getDateTimeString(date: Date): string {
		const day = this.getDayName(date);
		const dateString = this.getDateString(date);
		const timeString = this.getTimeString(date);

		return `${day}, ${dateString}, ${timeString}`;
	}

	getDayName(date: Date): string {
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

	getString(date: Date): string {
		return date.toLocaleString(browser.getLanguages(), {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		});
	}

	getDateString(date: Date): string {
		return date.toLocaleDateString(browser.getLanguages());
	}

	getTimeString(date: Date): string {
		return date.toLocaleTimeString(browser.getLanguages(), {
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	getNowDate(): Date {
		return new Date();
	}

	getNowTime(): number {
		return new Date().getTime();
	}

	getUrlParams(): ParsedQuery {
		return queryString.parse(window.location.search);
	}

	scrollIntoView(el: Element, options: { offset?: number } = {}): void {
		const { offset = 0 } = options;
		const pos = el.getBoundingClientRect().top;
		const scrollableParent = getScrollableParent(el);

		scrollableParent.scrollTo({
			top: pos - offset,
		});
	}

	getScrollPercentage(el: Element): number {
		return el.scrollTop / (el.scrollHeight - el.clientHeight);
	}

	getLastMidnight(date: Date = browser.getNowDate()): Date {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d;
	}
}

const browser = new Browser();

export default browser;
