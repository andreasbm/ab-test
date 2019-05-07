import "@appnest/web-router";
import { RouterSlot } from "@appnest/web-router";
import { setTest, Test } from "../lib/test/test";
import { TestEvent, Experiments } from "../lib/typings";
import { debounce } from "../lib/util/debounce";
import "./main.scss";

declare global {
	interface Window {
		gtag: any;
	}
}

// Setup the experiments
const test = new Test();
test.addEventListener(TestEvent.UPDATE, (e: CustomEvent<Experiments>) => {
	test.save();
	debounce(() => {
		console.log("Update analytics tool", e.detail);
		console.log(JSON.stringify(e.detail));
		window.gtag("config", "UA-96179028-1", {dimension1: JSON.stringify(e.detail)});
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
