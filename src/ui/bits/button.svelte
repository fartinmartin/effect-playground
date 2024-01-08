<script lang="ts">
	import { Button } from "bits-ui";
</script>

<Button.Root {...$$restProps} on:click on:keydown>
	<slot />
</Button.Root>

<style lang="scss">
	:global([data-button-root]) {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		height: 2.25rem;
		padding: 0 1.5rem;
		border-radius: 4px;

		font-size: 0.875rem;
		font-weight: 600;
		background: tomato;

		&:hover {
			background: black;
			color: tomato;
		}

		&:active {
			transform: scale(98%);
			transition: all;
		}
	}
</style>
