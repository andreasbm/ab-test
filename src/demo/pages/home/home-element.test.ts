import "./home-element";
import HomeElement from "./home-element";

describe("home-element", () => {
	let {expect} = chai;
	let $elem: HomeElement;
	let $container: HTMLElement;

	before(() => {
		$container = document.createElement("div");
		document.body.appendChild($container);
	});
	beforeEach(async () => {
		$container.innerHTML = `<home-element></home-element>`;

		await window.customElements.whenDefined("home-element");
		$elem = $container.querySelector<HomeElement>("home-element")!;
	});
	after(() => $container.remove());

	it("should be able to be stamped into the DOM", () => {
		expect($elem).to.exist;
	});
});