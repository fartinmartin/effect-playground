import type { Platform as _P } from "@tauri-apps/api/os";

export type Platform = "darwin" | "win32"; // | "linux"
export type PlatformMap<T> = Pick<{ [key in _P]: T }, Platform>;
