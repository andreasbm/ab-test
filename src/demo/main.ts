import "@appnest/web-router";
import { RouterSlot } from "@appnest/web-router";
import { Experiment, setExperiment } from "../lib/experiment/experiment";
import "./main.scss";
import { Tests } from "../lib/typings";
import { debounce } from "../lib/util/debounce";

declare global {
	interface Window {
		dataLayer: Array<unknown>;
		ga: any;
	}
}

const gaEvents = ["header.title.text", "header.text.simple-word", "header.text.long", "theme-color", "cta", "element", "element.headline"];

// Setup the experiments
const experiment = new Experiment();
experiment.addEventListener("update", (e: CustomEvent<Tests>) => {
	experiment.save();
	debounce(() => {
		console.log("Update analytics tool", e.detail);
		for (const [key, value] of Object.entries(e.detail)) {
			window.ga("set", `dimension${gaEvents.indexOf(key) + 1}`, value);
		}

	}, {ms: 500, id: "commit"})
});

setExperiment(experiment);
experiment.load();

customElements.whenDefined("router-slot").then(async () => {
	const routerSlot = document.querySelector<RouterSlot>("router-slot")!;
	await routerSlot.add([
		{
			path: "home",
			component: () => import("./pages/home/home-element")
		},
		{
			path: "**",
			redirectTo: "home"
		}
	]);
});
