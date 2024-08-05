import useIsDue from './useIsDue';
import { makeTask } from './test/makeTask';
import { expect, it, describe, vi } from 'vitest';

describe('useIsDue', () => {
	it('returns is due', () => {
		vi.setSystemTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940,
			}),
		);

		expect(result).toBeTruthy();
	});

	it('returns is not due if far future', () => {
		vi.setSystemTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940 + 24 * 60 * 60,
			}),
		);

		expect(result).toBeFalsy();
	});

	it('returns is not due if in past', () => {
		vi.setSystemTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940 - 1,
			}),
		);

		expect(result).toBeFalsy();
	});

	it('returns is not due if task completed', () => {
		vi.setSystemTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940,
				complete: true,
			}),
		);

		expect(result).toBeFalsy();
	});

	it('returns is not due if task uncled or expired', () => {
		vi.setSystemTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940,
				status: 'expired',
			}),
		);

		expect(result).toBeFalsy();
	});
});
