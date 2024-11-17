<script lang="ts">
export let task: TaskType;
</script>

<li>
	<h3>{task.task}</h3>
	<p>Due: {new Date(task.due).toLocaleString()}</p>
	<p>Amount: ${task.cents / 100}</p>
</li>

<style>
	li {
		margin: 1rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>
