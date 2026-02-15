<script lang="ts">
	import type { ActionDefinition } from './types.js';

	let {
		actions,
		suggestedIds,
		selectedIds,
		onToggle
	}: {
		actions: ActionDefinition[];
		suggestedIds: string[];
		selectedIds: string[];
		onToggle: (id: string) => void;
	} = $props();

	/** Show badges for any action that is suggested OR selected. */
	const visibleActions = $derived(
		actions.filter((a) => suggestedIds.includes(a.id) || selectedIds.includes(a.id))
	);
</script>

{#if visibleActions.length > 0}
	<div class="action-badges">
		{#each visibleActions as action (action.id)}
			<button
				type="button"
				class="action-badge"
				class:active={selectedIds.includes(action.id)}
				title={action.description}
				onclick={() => onToggle(action.id)}
			>
				{#if action.icon}<span class="action-badge-icon">{action.icon}</span>{/if}
				{action.label}
			</button>
		{/each}
	</div>
{/if}

<style>
	.action-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		justify-content: center;
	}

	.action-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 10px;
		border: 1px solid var(--traek-badge-border, #444444);
		border-radius: 999px;
		background: var(--traek-badge-bg, rgba(255, 255, 255, 0.06));
		color: var(--traek-badge-text, #cccccc);
		font-size: 12px;
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s;
	}

	.action-badge:hover {
		background: var(--traek-badge-bg-hover, rgba(255, 255, 255, 0.1));
		border-color: var(--traek-badge-border-hover, #666666);
	}

	.action-badge.active {
		background: var(--traek-badge-bg-active, rgba(0, 216, 255, 0.15));
		border-color: var(--traek-badge-border-active, #00d8ff);
		color: var(--traek-badge-text-active, #00d8ff);
	}

	.action-badge-icon {
		font-size: 1.1em;
	}
</style>
