import { Effect } from "effect";
import { Apps, AppsLive, TauriLive } from "./services";
//

const program = Effect.gen(function* (_) {
	const apps = yield* _(Apps);
	const all = yield* _(apps.getAll);
	return all;
}).pipe(Effect.withLogSpan("effect-playground"));

const runnable = program.pipe(
	Effect.provide(TauriLive),
	Effect.provide(AppsLive)
);

export const run = () => Effect.runPromise(runnable);
