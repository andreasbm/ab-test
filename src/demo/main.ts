import "@appnest/web-router";
import { RouterSlot } from "@appnest/web-router";
import "./main.scss";

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
