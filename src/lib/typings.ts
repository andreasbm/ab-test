export type ExtractableValue<T> = T | ((experiment: IExperiment) => T);
export type Variation<T> = ExtractableValue<T>;
export type Variations<T> = ExtractableValue<Variation<T>[]>
export type TestValue = string | number | boolean;
export type Tests = {[id: string]: TestValue};

export interface IExperiment extends EventTarget {
	has (id: string): boolean;
	set (id: string, value: TestValue): void;
	setAll (tests: Tests): void;
	get (id: string): TestValue | undefined;
	getAll (): Tests;
	remove (id: string): void;
	removeAll (): void;
	getVariation<T> (variations: Variations<T>): T
}

