import { describe, it, expect } from 'vitest';
import { useAddTask } from './useAddTask';
import { addTask } from '@taskratchet/sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { TestWrapper } from '../test/renderWithQueryProvider';

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
