import queryString, { type ParsedQuery } from 'query-string';

function getLanguages(): string[] {
	if (typeof navigator !== 'undefined' && Array.isArray(navigator.languages) && navigator.languages.length > 0) {
		return navigator.languages.slice();
	}
	// Fallback for SSR/tests/older browsers
	if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
		return [navigator.language];
	}
	return ['en-US'];
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
	if (typeof window === 'undefined' || !window.location) {
		return {} as ParsedQuery;
	}
	return queryString.parse(window.location.search);
}

export function prefersDarkMode(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
		return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
