<script lang="ts">
	import { updateTask } from '@taskratchet/sdk';

	export let task: TaskType;
	export let onCopy: (task: TaskType) => void;

	function formatDue(date: Date): string {
		return date.toLocaleString();
	}

	async function toggleComplete() {
		if (!task.id) return;
		await updateTask(task.id, { complete: !task.complete });
		task.complete = !task.complete;
		task.status = task.complete ? 'complete' : 'pending';
	}
</script>

<li>
	<div class="task-container">
		<div class="menu">
			<button on:click={() => onCopy(task)}>Copy</button>
		</div>
		<input
			type="checkbox"
			checked={task.complete}
			disabled={!task.id || task.status === 'expired'}
			on:change={toggleComplete}
		/>
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
	.menu {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.menu button {
		background: none;
		border: none;
		color: var(--color);
		opacity: 0.7;
		cursor: pointer;
	}

	.menu button:hover {
		opacity: 1;
	}

	.task-container {
		position: relative;
	}
</style>
