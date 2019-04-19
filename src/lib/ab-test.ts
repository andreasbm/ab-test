import { getExperiment } from "./experiment";
import { IExperiment, TestValue, Variations } from "./typings";

/**
 * Selects a random variation and registers the test.
 * @param id
 * @param variations
 * @param experiment
 */
export const abTest = <T extends TestValue> (id: string,
                                             variations: Variations<T>,
                                             experiment: IExperiment = getExperiment()): T => {

	// Check if we already have a value for this id.
	if (experiment.has(id)) {
		return experiment.get(id) as T;
	}

	// Pick a random variation
	const variation = experiment.getVariation(variations);
	experiment.set(id, variation);
	return variation;
};

