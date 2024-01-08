import "./ui/styles/reset.scss";
import "./ui/styles/root.scss";
import App from "./app.svelte";

const app = new App({
	target: document.getElementById("app")!,
});

export default app;
