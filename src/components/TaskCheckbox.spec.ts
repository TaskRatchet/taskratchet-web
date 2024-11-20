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

    it('should not update task without id', async () => {
        const task: TaskType = {
            task: 'test task',
            due: '2024-01-01T00:00:00',
            cents: 100,
            complete: false,
            status: 'pending',
            timezone: 'UTC'
        };
        
        const event = new Event('change');
        
        await toggleComplete({ event, task, isConfirming: false });
        
        expect(updateTask).not.toHaveBeenCalled();
    });

    it('should prompt for confirmation when uncompleting past due task', async () => {
        const task: TaskType = {
            id: '123',
            task: 'test task',
            due: '2023-01-01T00:00:00',
            cents: 100,
            complete: true,
            status: 'complete',
            timezone: 'UTC'
        };
        
        vi.setSystemTime(new Date('2024-01-01'));
        const event = new Event('change');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        vi.spyOn(event, 'target', 'get').mockReturnValue(checkbox);
        vi.spyOn(window, 'confirm').mockReturnValue(false);
        
        await toggleComplete({ event, task, isConfirming: false });
        
        expect(window.confirm).toHaveBeenCalledWith(
            'This task is past due. Marking it incomplete will require contacting support to undo. Continue?'
        );
        expect(updateTask).not.toHaveBeenCalled();
        expect(checkbox.checked).toBe(true);
    });

    it('should update past due task when confirmed', async () => {
        const task: TaskType = {
            id: '123',
            task: 'test task', 
            due: '2023-01-01T00:00:00',
            cents: 100,
            complete: true,
            status: 'complete',
            timezone: 'UTC'
        };
        
        vi.setSystemTime(new Date('2024-01-01'));
        const event = new Event('change');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        vi.spyOn(event, 'target', 'get').mockReturnValue(checkbox);
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        
        await toggleComplete({ event, task, isConfirming: false });
        
        expect(updateTask).toHaveBeenCalledWith('123', { complete: false });
        expect(task.complete).toBe(false);
        expect(task.status).toBe('pending');
    });
});
