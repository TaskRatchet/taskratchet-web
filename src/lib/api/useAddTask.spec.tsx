import { addTask } from '@taskratchet/sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TestWrapper } from '../test/renderWithQueryProvider';
import { useAddTask } from './useAddTask';

describe('useAddTask', () => {
	it('should be defined', () => {
		expect(useAddTask).toBeDefined();
	});

	it('rounds due', async () => {
		const {
			result: {
				current: { mutate },
			},
		} = renderHook(() => useAddTask(() => {}), {
			wrapper: TestWrapper,
		});

		const due = 1.23; // 1 day from now

		mutate({
			task: 'Test Task',
			due,
			cents: 100,
		});

		await waitFor(() => {
			expect(addTask).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'Test Task',
					due: 1, // Assuming addTask expects seconds
					cents: 100,
				}),
			);
		});
	});
});
