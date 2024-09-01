import useDifferenceToNow from './useDifferenceToNow';
import { makeTask } from './test/makeTask';
import { expect, it, describe, vi } from 'vitest';

describe('useDifferenceToNow', () => {
	it('handles future due', () => {
		vi.setSystemTime(1623869940 * 1000);

		const result = useDifferenceToNow(
			makeTask({
				due_timestamp: 1623873540,
			}),
		);

		expect(result).toEqual('in 1h');
	});

	it('handles past due', () => {
		vi.setSystemTime(1623873540 * 1000);

		const result = useDifferenceToNow(
			makeTask({
				due_timestamp: 1623869940,
			}),
		);

		expect(result).toEqual('1h ago');
	});

	it('only shows two units max', () => {
		vi.setSystemTime(1623869940 * 1000);

		const result = useDifferenceToNow(
			makeTask({
				due_timestamp: 1623873540 * 2,
			}),
		);

		expect(result).toEqual('in 51y 5mo');
	});

	it('rounds seconds', () => {
		vi.setSystemTime(1623869940 * 1000 + 10);

		const result = useDifferenceToNow(
			makeTask({
				due_timestamp: 1623873540,
			}),
		);

		expect(result).toEqual('in 1h');
	});
});
