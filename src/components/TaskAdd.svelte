<script lang="ts">
	import { addTask } from '@taskratchet/sdk';
	import TaskModal from './TaskModal.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let isOpen = false;

	async function onSave(taskData: TaskType) {
		const lines = taskData.task.split(/\r?\n/);
		for (const line of lines) {
			const response = await addTask({
				task: line,
				due: taskData.due,
				cents: taskData.cents,
			});
			if (!response.ok) {
				return response;
			}
		}
		dispatch('tasksAdded');
	}
</script>

<TaskModal
	{isOpen}
	mode="add"
	on:close
	{onSave}
/>
