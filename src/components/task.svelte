<script lang="ts">
	import { updateTask } from '@taskratchet/sdk';
	import ConfirmModal from './ConfirmModal.svelte';

	let showUncleConfirm = false;
	export let task: TaskType;
	export let onCopy: (task: TaskType) => void;
	export let onEdit: (task: TaskType) => void;
	export let onUncle: (task: TaskType) => void;

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
			<button 
				on:click={() => onEdit(task)}
				disabled={!task.id || task.status !== 'pending'}>Edit</button>
			<button
				on:click={() => {
					if (confirm(`Are you sure you want to charge this task immediately?\n\nIf you confirm, you will immediately be charged ${task.cents / 100}.`)) {
						onUncle(task);
					}
				}}
				disabled={task.status !== 'pending'}>Charge immediately</button>
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

	.menu button:hover:not(:disabled) {
		opacity: 1;
	}

	.menu button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.task-container {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		position: relative;
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

<ConfirmModal 
	isOpen={showUncleConfirm}
	amount={task.cents / 100}
	onConfirm={() => {
		onUncle(task);
		showUncleConfirm = false;
	}}
	onCancel={() => showUncleConfirm = false}
/>
