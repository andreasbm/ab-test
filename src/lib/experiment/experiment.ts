import { getTest } from "../test/test";
import { ITest } from "../typings";

/**
 * Selects a random variation and registers the experiment.
 * @param id
 * @param variations
 * @param test
 */
export const experiment = <T = unknown> (id: string,
                                     variations: T[],
                                     test: ITest = getTest()): T => {

	// Check if we already have a value for this id.
	if (test.has(id)) {
		return test.get(id) as T;
	}

	// Pick a random variation
	const variation = test.getVariation(variations);
	test.set(id, variation);
	return variation;
};

