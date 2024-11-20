import { describe, it, expect, vi } from 'vitest';
import { updateTask } from '@taskratchet/sdk';
import { toggleComplete } from './TaskCheckbox';

vi.mock('@taskratchet/sdk', () => ({
    updateTask: vi.fn(),
}));

describe('TaskCheckbox', () => {
    it('should update task when toggled', async () => {
        const task: TaskType = {
            id: '123',
            task: 'test task',
            due: '2024-01-01T00:00:00',
            cents: 100,
            complete: false,
            status: 'pending',
            timezone: 'UTC'
        };
        
        vi.setSystemTime(new Date('2023-12-01'));
        const event = new Event('change');
        
        await toggleComplete({ event, task, isConfirming: false });
        
        expect(updateTask).toHaveBeenCalledWith('123', { complete: true });
    });
});
