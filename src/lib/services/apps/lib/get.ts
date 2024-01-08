import { Effect } from "effect";
import type { FileEntry } from "@tauri-apps/api/fs";
//
import { Tauri, type Platform, type PlatformMap } from "@/lib/services";
import { command, isDir } from "@/lib/utils/tauri";
//

export class App {
	path: string;
	version: string;
	displayName: string;
	displayVersion: string;
	executableName: string;

	constructor(options: App) {
		this.path = options.path;
		this.version = options.version;
		this.displayName = options.displayName;
		this.displayVersion = options.displayVersion;
		this.executableName = options.executableName;
	}
}

export const getApps = Effect.gen(function* (_) {
	const appDirs = yield* _(getAppDirs);

	const getAppsInAppDirs = Effect.forEach(appDirs, getAppsInDir, {
		concurrency: "unbounded",
	});

	return (yield* _(getAppsInAppDirs))
		.flat()
		.sort((a, b) => (a.displayName < b.displayName ? -1 : 1));
});

// //

const getAppsInDir = (root: string) =>
	Effect.gen(function* (_) {
		const OPTIONS = { concurrency: "inherit" } as const;

		const { fs } = yield* _(Tauri);

		const exists = yield* _(fs.exists(root));
		const _isDir = yield* _(isDir(root));

		if (!exists || !_isDir) return [];

		const entries = yield* _(fs.readDir(root));
		const appEntries = yield* _(Effect.filter(entries, isAppEntry, OPTIONS));

		return yield* _(Effect.forEach(appEntries, getAppFromEntry, OPTIONS));
	});

const getAppFromEntry = (entry: FileEntry) =>
	Effect.gen(function* (_) {
		const { path } = yield* _(Tauri);

		return new App({
			path: entry.path,
			displayName: yield* _(getAppDisplayName(entry)),
			executableName: yield* _(path.basename(entry.path)),
			version: yield* _(getAppVersion(entry)),
			displayVersion: yield* _(getAppDisplayVersion(entry)),
		});
	});

//

const getAppDirs = Effect.gen(function* (_) {
	const { os, path } = yield* _(Tauri);

	const platform = (yield* _(os.platform())) as Platform;
	const userPaths: string[] = [];

	const paths = {
		win32: [yield* _(path.join("C:", "Program Files", "Adobe")), ...userPaths],
		darwin: [yield* _(path.join("/", "Applications")), ...userPaths],
	} satisfies PlatformMap<string[]>;

	return paths[platform];
});

const isAppEntry = (entry: FileEntry) =>
	Effect.gen(function* (_) {
		const { os, path } = yield* _(Tauri);

		const platform = (yield* _(os.platform())) as Platform;
		const getExt = Effect.orElseSucceed(
			path.extname(entry.path),
			() => Effect.succeed("noop") // not an app
		);

		const ext = yield* _(getExt);

		return platform === "win32" ? ext === "exe" : ext === "app";
	});

const getAppVersion = (entry: FileEntry) =>
	Effect.gen(function* (_) {
		const { path } = yield* _(Tauri);
		const plistPath = yield* _(path.join(entry.path, "Contents", "Info.plist"));
		return yield* _(
			command({
				darwin: ["mac-defaults", ["read", plistPath, "CFBundleShortVersionString"]], // prettier-ignore
				win32: ["win-powershell", [`(Get-Item -path "${entry.path}").VersionInfo.ProductVersion`]], // prettier-ignore
			})
		);
	});

const getAppDisplayVersion = (entry: FileEntry) =>
	Effect.gen(function* (_) {
		const { path } = yield* _(Tauri);
		const plistPath = yield* _(path.join(entry.path, "Contents", "Info.plist"));
		return yield* _(
			command({
				darwin: ["mac-defaults", ["read", plistPath, "CFBundleShortVersionString"]], // prettier-ignore
				win32: ["win-powershell", [`(Get-Item -path "${entry.path}").VersionInfo.ProductVersion`]], // prettier-ignore
			})
		);
	});

const getAppDisplayName = (entry: FileEntry) =>
	Effect.gen(function* (_) {
		const { path } = yield* _(Tauri);
		const plistPath = yield* _(path.join(entry.path, "Contents", "Info.plist"));
		return yield* _(
			command({
				darwin: ["mac-defaults", ["read", plistPath, "CFBundleDisplayName"]], // prettier-ignore
				win32: ["win-powershell", [`(Get-Item -path "${entry.path}").VersionInfo.FileDescription`]], // prettier-ignore
			})
		);
	});
