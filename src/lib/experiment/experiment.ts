import { IExperiment, Tests, TestValue, Variations } from "../typings";
import { extractValue } from "../util/extract-value";
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
		this.addEventListener(ExperimentEvent.UPDATE, this.save.bind(this));
		this.load();
	}

	/**
	 * Sets a test.
	 * @param id
	 * @param value
	 */
	set (id: string, value: TestValue) {
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
	get (id: string) {
		return this.tests[id];
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
	getVariation<T> (variations: Variations<T>): T {
		return extractValue(randomItemFromList(extractValue(variations, this))!, this);
	}

	/**
	 * Dispatches an update event.
	 */
	protected didUpdate () {
		this.dispatchEvent(new CustomEvent(ExperimentEvent.UPDATE, {detail: this.getAll()}));
	}

	/**
	 * Saves tests to local storage.
	 */
	protected save () {
		localStorage.setItem(this.storageKey, JSON.stringify(this.tests));
	}

	/**
	 * Loads tests from local storage.
	 */
	protected load () {
		const currentTests = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
		this.setAll(currentTests);
	}
}


/**
 * Singleton pattern for the global experiment.
 */
let _experiment: IExperiment = new Experiment();

/**
 * Sets the global experiment.
 * @param experiment
 */
export const setExperiment = (experiment: IExperiment) => {
	_experiment = experiment;
};

/**
 * Returns the global experiment.
 */
export const getExperiment = (): IExperiment => {
	return _experiment;
};