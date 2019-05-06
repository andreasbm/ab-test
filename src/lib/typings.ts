export type Tests = {[id: string]: unknown};
export type Properties = {[key: string]: unknown;};
export type ElementImporter = (() => Promise<unknown>);

export interface IExperiment extends EventTarget {
	has (id: string): boolean;
	set<T> (id: string, value: T): void;
	setAll (tests: Tests): void;
	get<T> (id: string): T | undefined;
	getAll (): Tests;
	remove (id: string): void;
	removeAll (): void;
	save(): void;
	load(): void;
	getVariation<T> (variations: T[]): T;
}

