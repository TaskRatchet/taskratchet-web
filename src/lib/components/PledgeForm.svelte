<script lang="ts">
	let what = '';
	let amount = 0;
	let deadline = '';

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		
		const formData = {
			what,
			amount,
			deadline
		};
		
		console.log('Form submitted:', formData);
		// TODO: Add actual form submission logic
	}
</script>

<form on:submit={handleSubmit} class="max-w-md mx-auto p-6 space-y-4">
	<div class="space-y-2">
		<label for="what" class="block text-sm font-medium text-gray-700">What</label>
		<input
			type="text"
			id="what"
			name="what"
			bind:value={what}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
		/>
	</div>

	<div class="space-y-2">
		<label for="amount" class="block text-sm font-medium text-gray-700">Amount (whole $)</label>
		<input
			type="number"
			id="amount"
			name="amount"
			bind:value={amount}
			min="0"
			step="1"
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
		/>
	</div>

	<div class="space-y-2">
		<label for="deadline" class="block text-sm font-medium text-gray-700">Deadline</label>
		<input
			type="datetime-local"
			id="deadline"
			name="deadline"
			bind:value={deadline}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
		/>
	</div>

	<button 
		type="submit"
		class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
	>
		Create Pledge
	</button>
</form>