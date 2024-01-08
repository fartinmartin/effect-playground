import { Effect, Context, Layer } from "effect";
//
import { Tauri, TauriError } from "..";
//
import { type App } from "./types";
import { getApps } from "./lib/get";

export interface Apps {
	readonly getAll: Effect.Effect<Tauri, TauriError, App[]>;
}

export const Apps = Context.Tag<Apps>();

export const AppsLive = Layer.succeed(
	Apps,
	Apps.of({
		getAll: getApps,
	})
);

export * from "./types";

export class AppsError {
	readonly _tag = "AppsError";
}
