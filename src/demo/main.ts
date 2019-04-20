import "@appnest/web-router";
import { RouterSlot } from "@appnest/web-router";
import { Experiment, setExperiment } from "../lib/experiment/experiment";
import "./main.scss";
import { Tests } from "../lib/typings";
import { debounce } from "../lib/util/debounce";

declare global {
	interface Window {
		dataLayer: Array<unknown>
	}
}

const experiment = new Experiment();
setExperiment(experiment);
experiment.addEventListener("update", (e: CustomEvent<Tests>) => {
	debounce(() => {
		console.log("Update analytics tool", e.detail);
		window.dataLayer.push(e.detail);

	}, {ms: 500, id: "commit"})
});


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
