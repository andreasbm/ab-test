import { getExperiment } from "../experiment/experiment";
import { IExperiment } from "../typings";

/**
 * Selects a random variation and registers the test.
 * @param id
 * @param variations
 * @param experiment
 */
export const abTest = <T = unknown> (id: string,
                                     variations: T[],
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

