import { describe, it, expect } from 'vitest';
import pipeMap from './pipeMap';

describe('pipeMap', () => {
	it('maps correctly', () => {
		const input = {
			a: 'val',
		};

		const output = pipeMap(input, [['a', 'c.d']]);

		expect(output).toEqual({
			c: {
				d: 'val',
			},
		});
	});
});
