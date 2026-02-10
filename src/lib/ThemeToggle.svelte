<script lang="ts">
	import { onMount } from 'svelte';
	import { theme as themeStore, type Theme } from '$lib/theme';

	const STORAGE_KEY = 'traek-theme';

	let theme: Theme = 'dark';
	let mounted = false;

	function getStoredTheme(): Theme | null {
		if (typeof window === 'undefined') return null;
		const t = localStorage.getItem(STORAGE_KEY);
		return t === 'light' || t === 'dark' ? t : null;
	}

	function getSystemTheme(): Theme {
		if (typeof window === 'undefined') return 'dark';
		return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
	}

	function getEffectiveTheme(): Theme {
		const stored = getStoredTheme();
		return stored ?? getSystemTheme();
	}

	function applyTheme(next: Theme) {
		theme = next;
		themeStore.set(next);
		document.documentElement.setAttribute('data-theme', next);
	}

	function toggle() {
		const effective = getEffectiveTheme();
		const next: Theme = effective === 'dark' ? 'light' : 'dark';
		localStorage.setItem(STORAGE_KEY, next);
		applyTheme(next);
	}

	onMount(() => {
		const effective = getEffectiveTheme();
		theme = effective;
		themeStore.set(effective);
		document.documentElement.setAttribute('data-theme', effective);
		mounted = true;

		const media = window.matchMedia('(prefers-color-scheme: light)');
		const handleChange = () => {
			if (getStoredTheme() !== null) return;
			const next = media.matches ? 'light' : 'dark';
			theme = next;
			themeStore.set(next);
			document.documentElement.setAttribute('data-theme', next);
		};
		media.addEventListener('change', handleChange);
		return () => media.removeEventListener('change', handleChange);
	});
</script>

<button
	type="button"
	class="theme-toggle"
	title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	on:click={toggle}
>
	{#if mounted}
		{#if theme === 'dark'}
			<svg
				class="icon"
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="4" />
				<path
					d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
				/>
			</svg>
		{:else}
			<svg
				class="icon"
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		{/if}
	{/if}
</button>

<style>
	.theme-toggle {
		position: fixed;
		top: 3rem;
		right: 1rem;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		border: 1px solid var(--traek-pill-border);
		border-radius: 999px;
		background: var(--traek-pill-bg);
		color: var(--traek-landing-text-muted-5);
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease,
			transform 0.1s ease;
	}

	.theme-toggle:hover {
		background: var(--traek-demo-button-bg);
		border-color: var(--traek-demo-border-hover);
		color: var(--traek-landing-text-main);
		transform: scale(1.05);
	}

	.theme-toggle:focus-visible {
		outline: 2px solid var(--traek-accent-cyan);
		outline-offset: 2px;
	}

	.icon {
		flex-shrink: 0;
	}
</style>
