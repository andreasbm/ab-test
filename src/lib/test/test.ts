import { ExperimentEvent, Experiments, ITest } from "../typings";
import { randomItemFromList } from "../util/random";

const EVENT_TARGET = window;

/**
 * A test is a collection of experiments.
 */
export class Test implements ITest {
	protected experiments: Experiments = {};

	/**
	 * Hooks up the experiment.
	 */
	constructor (protected storageKey: string = "tests") {
	}

	/**
	 * Sets an experiment.
	 * @param id
	 * @param value
	 */
	set<T> (id: string, value: T) {
		this.experiments[id] = value;
		this.didUpdate();
	}

	/**
	 * Returns whether an experiment with the id exists.
	 * @param id
	 */
	has (id: string) {
		return this.experiments[id] != undefined;
	}

	/**
	 * Returns an experiment with a given id.
	 * @param id
	 */
	get<T> (id: string) {
		return this.experiments[id] as T;
	}

	/**
	 * Returns all experiments.
	 */
	getAll () {
		return this.experiments;
	}

	/**
	 * Removes an experiment with a given id.
	 * @param id
	 */
	remove (id: string) {
		if (this.has(id)) {
			delete this.experiments[id];
		}

		this.didUpdate();
	}

	/**
	 * Removes all experiments.
	 */
	removeAll () {
		this.experiments = {};
		this.didUpdate();
	}

	/**
	 * Sets an array of experiments.
	 * @param tests
	 */
	setAll (tests: Experiments) {
		for (const [id, value] of Object.entries(tests)) {
			this.experiments[id] = value;
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
	 * Saves experiments to local storage.
	 */
	save () {
		localStorage.setItem(this.storageKey, JSON.stringify(this.experiments));
	}

	/**
	 * Loads experiments from local storage.
	 */
	load () {
		const tests = localStorage.getItem(this.storageKey);
		if (tests != null) {
			const currentTests = JSON.parse(tests);
			this.setAll(currentTests);
		}
	}

	/**
	 * Adds event listener.
	 * @param type
	 * @param listener
	 * @param options
	 */
	addEventListener (type: ExperimentEvent,
	                  listener: EventListenerOrEventListenerObject,
	                  options?: boolean | AddEventListenerOptions) {
		EVENT_TARGET.addEventListener(type, listener, options);
	}

	/**
	 * Removes event listener.
	 * @param type
	 * @param listener
	 * @param options
	 */
	removeEventListener (type: ExperimentEvent,
	                     listener: EventListenerOrEventListenerObject,
	                     options?: boolean | EventListenerOptions) {
		EVENT_TARGET.removeEventListener(type, listener, options);
	}

	/**
	 * Dispatches an update event.
	 */
	protected didUpdate () {
		EVENT_TARGET.dispatchEvent(new CustomEvent(ExperimentEvent.UPDATE, {detail: this.getAll()}));
	}
}


/**
 * Singleton pattern for the global experiment.
 */
export let test: ITest = new Test();

/**
 * Sets the global experiment.
 * @param _test
 */
export const setTest = (_test: ITest) => {
	test = _test;
};

/**
 * Returns the global experiment.
 */
export const getTest = (): ITest => {
	return test;
};
