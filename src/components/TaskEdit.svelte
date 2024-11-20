<script lang="ts">
	import { editTask } from '@taskratchet/sdk';
	import TaskModal from './TaskModal.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let task: TaskType;
	export let isOpen = false;

	function onSave(updatedTask: TaskType) {
		if (!task.id) return;
		if (updatedTask.cents < task.cents) {
			return 'Stakes cannot be less than the original task';
		}
		if (new Date(updatedTask.due) > new Date(task.due)) {
			return 'Cannot postpone due date';
		}
		return editTask(task.id, updatedTask.due, updatedTask.cents);
	}
</script>

<TaskModal
	{isOpen}
	mode="edit"
	sourceTask={task}
	on:close
	{onSave}
/>
