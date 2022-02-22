import useDifferenceToNow from './useDifferenceToNow';
import { loadNowTime, makeTask } from './test/helpers';

describe('useDifferenceToNow', () => {
	it('handles future due', async () => {
		loadNowTime(1623869940 * 1000);

		const result = useDifferenceToNow(
			makeTask({
				due_timestamp: 1623873540,
			})
		);

		expect(result).toEqual('in 1h');
	});

	it('handles past due', async () => {
		loadNowTime(1623873540 * 1000);

		const result = useDifferenceToNow(
			makeTask({
				due_timestamp: 1623869940,
			})
		);

		expect(result).toEqual('1h ago');
	});

	it('only shows two units max', async () => {
		loadNowTime(1623869940 * 1000);

		const result = useDifferenceToNow(
			makeTask({
				due_timestamp: 1623873540 * 2,
			})
		);

		expect(result).toEqual('in 51y 5mo');
	});

	it('rounds seconds', async () => {
		loadNowTime(1623869940 * 1000 + 10);

		const result = useDifferenceToNow(
			makeTask({
				due_timestamp: 1623873540,
			})
		);

		expect(result).toEqual('in 1h');
	});
});
