<script lang="ts">
export let task: TaskType;

function formatDue(date: Date): string {
    return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}
</script>

<li>
    <div class="task-container">
        <input type="checkbox" checked={task.complete} disabled />
        <div class="task-content">
            <div class="task-text">{task.task}</div>
            <div class="task-details">
                ${task.cents / 100} • due by {formatDue(new Date(task.due))}
            </div>
        </div>
    </div>
</li>

<style>
    li {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .task-container {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }

    .task-content {
        flex: 1;
    }

    .task-details {
        color: #666;
        font-size: 0.9em;
        margin-top: 0.25rem;
    }
</style>
