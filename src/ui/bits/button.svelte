<script lang="ts">
	import { Button } from "bits-ui";
</script>

<Button.Root>
	<slot />
</Button.Root>

<style lang="scss">
	:global([data-button-root]) {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		height: 2rem;
		padding: 0 1.5rem;
		border-radius: 2px;

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
