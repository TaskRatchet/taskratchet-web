import { editTask } from '@taskratchet/sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect,it } from 'vitest';

import { TestWrapper } from '../test/renderWithQueryProvider';
import useEditTask from './useEditTask';

describe('useEditTask', () => {
	it('should be defined', () => {
		expect(useEditTask).toBeDefined();
	});

	it('rounds due', async () => {
		const {
			result: {
				current: { mutate },
			},
		} = renderHook(useEditTask, {
			wrapper: TestWrapper,
		});

		mutate({
			id: '1',
			due: 1.23,
			cents: 100,
		});

		await waitFor(() => {
			expect(editTask).toHaveBeenCalledWith(
				expect.anything(),
				1,
				expect.anything(),
			);
		});
	});
});
