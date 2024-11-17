<script lang="ts">
    export let isOpen = false;
    export let onConfirm: () => void;
    export let onCancel: () => void;
    export let amount: number;
</script>

{#if isOpen}
    <div class="modal">
        <div class="modal-content">
            <h2>Charge Immediately?</h2>
            <p>Are you sure you want to charge this task immediately?</p>
            <p>If you confirm, you will immediately be charged ${amount.toFixed(2)}.</p>
            <div class="buttons">
                <button on:click={onCancel}>Cancel</button>
                <button on:click={onConfirm}>Charge</button>
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
        background: var(--background);
        color: var(--color);
        padding: 2rem;
        border-radius: 4px;
        width: 90%;
        max-width: 500px;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
    }

    button {
        background: var(--background);
        color: var(--color);
        border: 1px solid var(--color);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: var(--primary);
        border-color: var(--primary);
        color: white;
    }
</style>
