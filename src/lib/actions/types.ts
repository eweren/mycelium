/**
 * Definition for a single action that can be suggested to the user.
 */
export interface ActionDefinition {
	/** Unique identifier (e.g. "image", "debug"). */
	id: string;
	/** Human-readable label shown on the badge. */
	label: string;
	/** Short description shown as tooltip. */
	description: string;
	/** Optional icon (emoji or short string). */
	icon?: string;
	/** Keywords for fast local matching (stage 1). Case-insensitive. */
	keywords?: string[];
	/** Slash command trigger without the leading `/` (e.g. "image"). */
	slashCommand?: string;
}

/**
 * Callback for stage-2 (semantic) action resolution.
 * Receives the current user input and the full list of available actions.
 * Should return the IDs of actions that match the input.
 */
export type ResolveActions = (input: string, actions: ActionDefinition[]) => Promise<string[]>;
