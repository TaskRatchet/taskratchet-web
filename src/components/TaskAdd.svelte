<script lang="ts">
import { addTask } from '@taskratchet/sdk';
import { formatDue } from '../lib/formatDue';

export let isOpen = false;

let task = '';
let cents = 500;
let due = getDefaultDue();
let error = '';

function getDefaultDue() {
    const due = new Date();
    due.setDate(due.getDate() + 7);
    due.setHours(23);
    due.setMinutes(59);
    return formatDue(due);
}

async function onSubmit() {
    if (!task) {
        error = 'Task is required';
        return;
    }
    
    const lines = task.split(/\r?\n/);
    for (const line of lines) {
        await addTask({ task: line, due, cents });
    }
}
</script>

{#if isOpen}
<div class="modal">
    <div class="modal-content">
        <h2>Add Task</h2>
        
        {#if error}
            <div class="error">{error}</div>
        {/if}

        <div class="form">
            <textarea 
                bind:value={task}
                placeholder="Task"
                rows="3"
            />

            <input 
                type="number" 
                bind:value={cents}
                min="100"
                step="100"
            />

            <input 
                type="datetime-local" 
                bind:value={due}
            />

            <div class="timezone">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>

            <div class="buttons">
                <button on:click={() => isOpen = false}>Cancel</button>
                <button on:click={onSubmit}>Add</button>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 4px;
        width: 90%;
        max-width: 500px;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    .error {
        color: red;
        margin-bottom: 1rem;
    }
</style>
