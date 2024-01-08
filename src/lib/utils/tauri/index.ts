import { Effect, String } from "effect";
//
import { type FileEntry } from "@tauri-apps/api/fs";
import { Command } from "@tauri-apps/api/shell";
//
import { type Platform, type PlatformMap, Tauri } from "@/lib/services";

export const isDir = (entry: FileEntry | string) =>
	Effect.gen(function* (_) {
		const testReadDir = Effect.gen(function* (_) {
			const { fs } = yield* _(Tauri);
			const path = String.isString(entry) ? entry : entry.path;
			return yield* _(fs.readDir(path));
		});

		const isDir = Effect.orElse(testReadDir, () => Effect.succeed(false));

		return !!(yield* _(isDir));
	});

//

type Params = ConstructorParameters<typeof Command>;
export type Commands = PlatformMap<Params>;

export const command = (
	commands: Commands,
	options?: {
		onError?: (error: string) => Effect.Effect<never, never, void>;
		onOut?: (stdout: string) => Effect.Effect<never, never, void>;
	}
) =>
	// TODO: this can fail
	Effect.gen(function* (_) {
		const { os, shell } = yield* _(Tauri);
		const platform = (yield* _(os.platform())) as Platform;
		const [program, args] = commands[platform];

		const { Command } = shell;
		const cmd = new Command(program, args);
		const response = yield* _(Effect.promise(() => cmd.execute()));

		const { stderr, stdout } = response;
		if (stderr && options?.onError) yield* _(options.onError(stderr));
		if (stdout && options?.onOut) yield* _(options.onOut(stdout));

		return stdout;
	});
