import { describe, it, expect, vi } from 'vitest';
import { updateTask } from '@taskratchet/sdk';

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
        
        await toggleComplete(event, task);
        
        expect(updateTask).toHaveBeenCalledWith('123', { complete: true });
    });
});

async function toggleComplete(event: Event, task: TaskType) {
    if (!task.id) return;

    const taskDue = new Date(task.due);
    const now = new Date();
    const isPastDue = taskDue < now;

    if (isPastDue && task.complete) {
        const confirmed = confirm(
            'This task is past due. Marking it incomplete will require contacting support to undo. Continue?'
        );
        if (!confirmed) return;
    }

    await updateTask(task.id, { complete: !task.complete });
    task.complete = !task.complete;
    task.status = task.complete ? 'complete' : 'pending';
}
