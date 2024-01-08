<script lang="ts">
	import { apps, time } from "@/stores/apps";
	import App from "./apps-item.svelte";
</script>

<div class="apps-list">
	{#if $apps.length}
		<header>{$apps.length} apps found in {$time} seconds</header>

		<div>
			{#each $apps as app}
				<App {app} />
			{/each}
		</div>
	{:else}
		<pre>no apps</pre>
	{/if}
</div>

<style lang="scss">
	.apps-list {
		width: 100%;
		flex-grow: 1;
	}

	header {
		margin-bottom: 0.5rem;
		text-align: center;
	}
</style>
