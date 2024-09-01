import { describe, it, expect } from 'vitest';

describe('vitest', () => {
	it('test 1', () => {
		window.localStorage.setItem('date', '2020-01-01');
		expect(window.localStorage.getItem('date')).toBe('2020-01-01');
	});

	it('test 2', () => {
		window.localStorage.setItem('date', '2020-01-02');
		expect(window.localStorage.getItem('date')).toBe('2020-01-02');
	});

	it('test 3', () => {
		expect(window.localStorage.getItem('date')).toBe(null);
	});
});
