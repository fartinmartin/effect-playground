import type { App } from "@/lib/services";
import { writable } from "svelte/store";

export const apps = writable<App[]>([]);
export const time = writable(0);
