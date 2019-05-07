export type Experiments = {[id: string]: unknown};
export type Properties = {[key: string]: unknown;};
export type ElementImporter = (() => Promise<unknown>);
export enum TestEvent {
	UPDATE = "update"
}

export interface ITest {
	has (id: string): boolean;
	set<T> (id: string, value: T): void;
	setAll (tests: Experiments): void;
	get<T> (id: string): T | undefined;
	getAll (): Experiments;
	remove (id: string): void;
	removeAll (): void;
	save(): void;
	load(): void;
	getVariation<T> (variations: T[]): T;
	addEventListener(type: TestEvent, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
	removeEventListener(type: TestEvent, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

}

