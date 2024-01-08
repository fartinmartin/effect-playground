<script lang="ts">
	import { run as EffectPlayground } from "@/lib/main";
	//
	import { apps, time } from "./stores/apps";
	//
	import Button from "@/ui/bits/button.svelte";
	import AppsList from "@/ui/components/apps-list.svelte";

	const run = async () => {
		const start = performance.now();
		$apps = await EffectPlayground();
		$time = (performance.now() - start) / 1000;
	};
</script>

<header>
	<h1><code>effect-playground</code></h1>
	<Button on:click={run}>get apps</Button>
</header>

<main>
	<AppsList />
</main>

<style lang="scss">
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
	}

	h1 {
		font-weight: 700;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem;
		flex-grow: 1;
	}
</style>
