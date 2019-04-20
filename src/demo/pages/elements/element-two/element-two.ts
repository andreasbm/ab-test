import { customElement, html, LitElement, property, unsafeCSS } from "lit-element";
import css from "./element-two.scss";
import "weightless/title";
import "weightless/text";

@customElement("element-two")
export class ElementTwo extends LitElement {
	static styles = [unsafeCSS(css)];

	@property({type: String}) headline: string;

	/**
	 * Renders the element.
	 */
	render () {
		return html`
			<wl-title level="3">${this.headline}</wl-title>
			<wl-text>Below you can see the current test values.</wl-text>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"element-two": ElementTwo;
	}
}