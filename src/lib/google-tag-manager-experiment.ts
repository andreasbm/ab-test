import { Experiment } from "./experiment";

declare global {
	interface Window {
		"dataLayer": Array<unknown>
	}
}

/**
 * https://developers.google.com/tag-manager/devguide
 */
export class GoogleTagManagerExperiment extends Experiment {

	protected saveTests () {
		super.saveTests();
		window.dataLayer.push(this.tests);
	}
}
