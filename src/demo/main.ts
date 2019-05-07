import "@appnest/web-router";
import { RouterSlot } from "@appnest/web-router";
import "./main.scss";
import { setTest, Test } from "../lib/ab-test/test";
import { Experiments } from "../lib/typings";
import { debounce } from "../lib/util/debounce";

declare global {
	interface Window {
		gtag: any;
	}
}

// Setup the experiments
const test = new Test();
test.addEventListener("update", (e: CustomEvent<Experiments>) => {
	test.save();
	debounce(() => {
		console.log("Update analytics tool", e.detail);
		console.log(JSON.stringify(e.detail));
		window.gtag("set", "dimension1", JSON.stringify(e.detail));
	}, {ms: 500, id: "commit"})
});

setTest(test);
test.load();

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
