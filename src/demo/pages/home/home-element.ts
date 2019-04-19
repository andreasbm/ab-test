import { customElement, html, LitElement, PropertyValues, unsafeCSS } from "lit-element";
import { repeat } from "lit-html/directives/repeat";
import "weightless/button";
import "weightless/text";
import "weightless/title";
import { setColor } from "weightless/util/theme";
import { abTest } from "../../../lib/ab-test";
import { getExperiment, setExperiment } from "../../../lib/experiment";
import { GoogleTagManagerExperiment } from "../../../lib/google-tag-manager-experiment";
import { Tests } from "../../../lib/typings";
import css from "./home-element.scss";

setExperiment(new GoogleTagManagerExperiment("tests"));

@customElement("home-element")
export default class HomeElement extends LitElement {
	static styles = [unsafeCSS(css)];

	private cta!: "github" | "npm";

	private clearTests () {
		localStorage.removeItem("tests");
		getExperiment().removeAll();
		this.requestUpdate().then();

		this.updateAbVariables();
	}

	firstUpdated (props: PropertyValues) {
		super.firstUpdated(props);
		this.updateAbVariables();

		/**
		 * Save the tests each time they are updated.
		 */
		getExperiment().addEventListener("set", (e: CustomEvent<Tests>) => {
			console.log("> Update the analytics tools");
			console.log(e.detail);
			this.requestUpdate().then();
		});
	}

	/**
	 * Updates some of the ab variables.
	 */
	private updateAbVariables () {

		// Get random theme color
		const hue = abTest("theme-color", [0, 50, 100, 150, 200, 250]);
		setColor("primary", "hue", hue);

		// Get random cta
		this.cta = abTest("cta", ["github", "npm"]);
	}

	/**
	 * Handles the check out.
	 */
	private checkOut () {
		switch (this.cta) {
			case "github":
				alert("Open github");
				break;
			case "npm":
				alert("Open NPM");
				break;
		}
	}

	/**
	 * Renders the element.
	 */
	render () {
		return html`
			<header id="header">
				<wl-title id="title">${abTest<string>("header.title.text", [
					() => "A/B testing", "A/B testing made simple", "Everyone should A/B test"]
				)}</wl-title>
				
					<wl-text id="text" size="large">
						${abTest("header.text.long", [true, false])
			? `To make clever decisions about what your next incremental change should be, you need data. `
			: undefined}This library makes A/B testing incredible ${abTest("header.text.simple-word", ["simple", "easy"])}!
					</wl-text>
				
				<wl-button @click="${this.checkOut}">
					${this.cta === "github"
						? "Check out on Github"
						: "Check out on NPM"
					}
				</wl-button>
			</header>
			
			<div id="info">
				${repeat(Object.entries(getExperiment().getAll()), (([id, value]) => html`
					<wl-text class="item"><b>${id}:</b> ${value}</wl-text>
				`))}
				<br />
				<wl-button @click="${this.clearTests}" inverted flat outlined>New A/B test</wl-button>
			</div>
			
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"home-element": HomeElement;
	}
}