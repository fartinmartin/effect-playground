import { Context, Effect, Layer } from "effect";

import * as TauriApi from "@tauri-apps/api";
type TauriApi = typeof TauriApi;

const make = Effect.gen(function* (_) {
	return {
		app: {
			getName: wrap((_) => _.app.getName),
			getTauriVersion: wrap((_) => _.app.getTauriVersion),
			getVersion: wrap((_) => _.app.getVersion),
			hide: wrap((_) => _.app.hide),
			show: wrap((_) => _.app.show),
		},
		cli: {
			getMatches: wrap((_) => _.cli.getMatches),
		},
		clipboard: {
			readText: wrap((_) => _.clipboard.readText),
			writeText: wrap((_) => _.clipboard.writeText),
		},
		dialog: {
			ask: wrap((_) => _.dialog.ask),
			confirm: wrap((_) => _.dialog.confirm),
			message: wrap((_) => _.dialog.message),
			open: wrap((_) => _.dialog.open),
			save: wrap((_) => _.dialog.save),
		},
		event: {
			emit: wrap((_) => _.event.emit),
			listen: wrap((_) => _.event.listen),
			once: wrap((_) => _.event.once),
		},
		fs: {
			copyFile: wrap((_) => _.fs.copyFile),
			createDir: wrap((_) => _.fs.createDir),
			exists: wrap((_) => _.fs.exists),
			readBinaryFile: wrap((_) => _.fs.readBinaryFile),
			readDir: wrap((_) => _.fs.readDir),
			readTextFile: wrap((_) => _.fs.readTextFile),
			removeDir: wrap((_) => _.fs.removeDir),
			removeFile: wrap((_) => _.fs.removeFile),
			renameFile: wrap((_) => _.fs.renameFile),
			writeBinaryFile: wrap((_) => _.fs.writeBinaryFile),
			writeTextFile: wrap((_) => _.fs.writeTextFile),
		},
		globalShortcut: {
			isRegistered: wrap((_) => _.globalShortcut.isRegistered),
			register: wrap((_) => _.globalShortcut.register),
			registerAll: wrap((_) => _.globalShortcut.registerAll),
			unregister: wrap((_) => _.globalShortcut.unregister),
			unregisterAll: wrap((_) => _.globalShortcut.unregisterAll),
		},
		http: {
			fetch: wrap((_) => _.http.fetch),
			getClient: wrap((_) => _.http.getClient),
		},
		notification: {
			isPermissionGranted: wrap((_) => _.notification.isPermissionGranted),
			requestPermission: wrap((_) => _.notification.requestPermission),
			// sendNotification: wrap((_) => _.notification.sendNotification),
		},
		os: {
			// EOL: "",
			//
			arch: wrap((_) => _.os.arch),
			locale: wrap((_) => _.os.locale),
			platform: wrap((_) => _.os.platform),
			tempdir: wrap((_) => _.os.tempdir),
			type: wrap((_) => _.os.type),
			version: wrap((_) => _.os.version),
		},
		path: {
			delimiter: variable((_) => _.path.delimiter),
			sep: variable((_) => _.path.sep),
			//
			appCacheDir: wrap((_) => _.path.appCacheDir),
			appConfigDir: wrap((_) => _.path.appConfigDir),
			appDataDir: wrap((_) => _.path.appDataDir),
			appDir: wrap((_) => _.path.appDir),
			appLocalDataDir: wrap((_) => _.path.appLocalDataDir),
			appLogDir: wrap((_) => _.path.appLogDir),
			audioDir: wrap((_) => _.path.audioDir),
			basename: wrap((_) => _.path.basename),
			cacheDir: wrap((_) => _.path.cacheDir),
			configDir: wrap((_) => _.path.configDir),
			dataDir: wrap((_) => _.path.dataDir),
			desktopDir: wrap((_) => _.path.desktopDir),
			dirname: wrap((_) => _.path.dirname),
			documentDir: wrap((_) => _.path.documentDir),
			downloadDir: wrap((_) => _.path.downloadDir),
			executableDir: wrap((_) => _.path.executableDir),
			extname: wrap((_) => _.path.extname),
			fontDir: wrap((_) => _.path.fontDir),
			homeDir: wrap((_) => _.path.homeDir),
			isAbsolute: wrap((_) => _.path.isAbsolute),
			join: wrap((_) => _.path.join),
			localDataDir: wrap((_) => _.path.localDataDir),
			logDir: wrap((_) => _.path.logDir),
			normalize: wrap((_) => _.path.normalize),
			pictureDir: wrap((_) => _.path.pictureDir),
			publicDir: wrap((_) => _.path.publicDir),
			resolve: wrap((_) => _.path.resolve),
			resolveResource: wrap((_) => _.path.resolveResource),
			resourceDir: wrap((_) => _.path.resourceDir),
			runtimeDir: wrap((_) => _.path.runtimeDir),
			templateDir: wrap((_) => _.path.templateDir),
			videoDir: wrap((_) => _.path.videoDir),
		},
		process: {
			exit: wrap((_) => _.process.exit),
			relaunch: wrap((_) => _.process.relaunch),
		},
		shell: {
			open: wrap((_) => _.shell.open),
			Command: yield* _(Effect.succeed(TauriApi.shell.Command)),
		},
		tauri: {
			// convertFileSrc: wrap((_) => _.tauri.convertFileSrc),
			invoke: wrap((_) => _.tauri.invoke),
			// transformCallback: wrap((_) => _.tauri.transformCallback),
		},
		updater: {
			checkUpdate: wrap((_) => _.updater.checkUpdate),
			installUpdate: wrap((_) => _.updater.installUpdate),
			onUpdaterEvent: wrap((_) => _.updater.onUpdaterEvent),
		},
		window: {
			// appWindow: "",
			//
			availableMonitors: wrap((_) => _.window.availableMonitors),
			currentMonitor: wrap((_) => _.window.currentMonitor),
			// getAll: wrap((_) => _.window.getAll),
			// getCurrent: wrap((_) => _.window.getCurrent),
			primaryMonitor: wrap((_) => _.window.primaryMonitor),
		},
	} as const;
});

export interface Tauri extends Effect.Effect.Success<typeof make> {}
export const Tauri = Context.Tag<Tauri>();

export const TauriLive = Layer.succeed(Tauri, Effect.runSync(make));

export * from "./types";

export class TauriError {
	readonly _tag = "TauriError";
	constructor(readonly reason: any) {}
}

// helpers

function wrap<A, Args extends any[]>(
	f: (_: TauriApi) => (...args: Args) => Promise<A>
) {
	return (...args: Args) =>
		Effect.tryPromise({
			try: () => f(TauriApi)(...args),
			catch: (reason) => new TauriError(reason as any),
		});
}

function variable<A>(f: (_: TauriApi) => A) {
	return () => Effect.succeed(f(TauriApi));
}
