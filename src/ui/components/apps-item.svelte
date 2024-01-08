<script lang="ts">
	import type { App } from "@/lib/services";

	export let app: App;
</script>

<div class="app">
	<div class="name-version">
		<h2>{app.displayName}</h2>
		<!-- <span>{app.displayVersion}</span> -->
		<code>{app.version}</code>
	</div>
	<div class="path">
		<pre>{app.path}</pre>
	</div>
</div>

<style lang="scss">
	.app {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		gap: 1rem;
		border-top: 1px solid goldenrod;
	}

	.name-version {
		display: flex;
		gap: 0.75rem;

		code {
			font-size: 0.75rem;
			background: #dbd4cf;
			padding: 0 0.375rem;
			border-radius: 4px;
		}
	}

	.path {
		opacity: 0.5;
		font-size: 0.75rem;
	}
</style>
