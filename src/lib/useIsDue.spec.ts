import useIsDue from './useIsDue';
import { loadNowTime, makeTask } from './test/helpers';

describe('useIsDue', () => {
	it('returns is due', async () => {
		loadNowTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940,
			})
		);

		expect(result).toBeTruthy();
	});

	it('returns is not due if far future', async () => {
		loadNowTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940 + 24 * 60 * 60,
			})
		);

		expect(result).toBeFalsy();
	});

	it('returns is not due if in past', async () => {
		loadNowTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940 - 1,
			})
		);

		expect(result).toBeFalsy();
	});

	it('returns is not due if task completed', async () => {
		loadNowTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940,
				complete: true,
			})
		);

		expect(result).toBeFalsy();
	});

	it('returns is not due if task uncled or expired', async () => {
		loadNowTime(1623869940 * 1000);

		const result = useIsDue(
			makeTask({
				due_timestamp: 1623869940,
				status: 'expired',
			})
		);

		expect(result).toBeFalsy();
	});
});