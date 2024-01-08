import { Equal, Data, Struct, pipe } from "effect";

export function isEqual(a: any, b: any) {
	return Equal.equals(Data.struct(a), Data.struct(b));
}

export function pick<T extends object, TKeys extends keyof T>(
	obj: T,
	keys: TKeys[]
) {
	// @ts-expect-error
	return pipe(obj, Struct.pick(...keys));
}
