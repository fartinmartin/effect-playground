import "./ui/styles/styles.css";
import App from "./app.svelte";

const app = new App({
	target: document.getElementById("app")!,
});

export default app;
