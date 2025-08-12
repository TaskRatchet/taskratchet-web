import queryString, { type ParsedQuery } from 'query-string';

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

export function prefersDarkMode(): boolean {
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
