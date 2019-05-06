import { IExperiment, Tests } from "../typings";
import { randomItemFromList } from "../util/random";

export enum ExperimentEvent {
	UPDATE = "update"
}

/**
 * An experiment is a collection of tests.
 */
export class Experiment extends EventTarget implements IExperiment {
	protected tests: Tests = {};

	/**
	 * Hooks up the experiment.
	 */
	constructor (protected storageKey: string = "tests") {
		super();
	}

	/**
	 * Sets a test.
	 * @param id
	 * @param value
	 */
	set<T> (id: string, value: T) {
		this.tests[id] = value;
		this.didUpdate();
	}

	/**
	 * Returns whether an id exists.
	 * @param id
	 */
	has (id: string) {
		return this.tests[id] != undefined;
	}

	/**
	 * Returns a test with a given id.
	 * @param id
	 */
	get<T> (id: string) {
		return this.tests[id] as T;
	}

	/**
	 * Returns all tests.
	 */
	getAll () {
		return this.tests;
	}

	/**
	 * Removes a test with a given id.
	 * @param id
	 */
	remove (id: string) {
		if (this.has(id)) {
			delete this.tests[id];
		}

		this.didUpdate();
	}

	/**
	 * Removes all tests.
	 */
	removeAll () {
		this.tests = {};
		this.didUpdate();
	}

	/**
	 * Sets an array of tests.
	 * @param tests
	 */
	setAll (tests: Tests) {
		for (const [id, value] of Object.entries(tests)) {
			this.tests[id] = value;
		}

		this.didUpdate();
	}

	/**
	 * Returns a random variation.
	 * @param variations
	 */
	getVariation<T> (variations: T[]): T {
		return randomItemFromList(variations)!;
	}

	/**
	 * Saves tests to local storage.
	 */
	save () {
		localStorage.setItem(this.storageKey, JSON.stringify(this.tests));
	}

	/**
	 * Loads tests from local storage.
	 */
	load () {
		const tests = localStorage.getItem(this.storageKey);
		if (tests != null) {
			const currentTests = JSON.parse(tests);
			this.setAll(currentTests);
		}
	}

	/**
	 * Dispatches an update event.
	 */
	protected didUpdate () {
		this.dispatchEvent(new CustomEvent(ExperimentEvent.UPDATE, {detail: this.getAll()}));
	}
}


/**
 * Singleton pattern for the global experiment.
 */
export let experiment: IExperiment = new Experiment();

/**
 * Sets the global experiment.
 * @param exp
 */
export const setExperiment = (exp: IExperiment) => {
	experiment = exp;
};

/**
 * Returns the global experiment.
 */
export const getExperiment = (): IExperiment => {
	return experiment;
};
