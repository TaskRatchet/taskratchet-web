import { makeTask } from './test/helpers';
import { sortTasks } from './sortTasks';

describe('sortTasks', () => {
	it('has secondary sort by stakes', () => {
		const input = [
			makeTask({ cents: 100, id: 1 }),
			makeTask({ cents: 500, id: 2 }),
		];
		const expected = [
			makeTask({ cents: 500, id: 2 }),
			makeTask({ cents: 100, id: 1 }),
		];

		expect(sortTasks(input)).toEqual(expected);
	});

	it('has tertiary sort by alphabet', () => {
		const input = [
			makeTask({ task: 'b', id: 1 }),
			makeTask({ task: 'a', id: 2 }),
		];
		const expected = [
			makeTask({ task: 'a', id: 2 }),
			makeTask({ task: 'b', id: 1 }),
		];

		expect(sortTasks(input)).toEqual(expected);
	});
});
