import { customElement, html, LitElement, property, unsafeCSS } from "lit-element";
import css from "./element-one.scss";
import "weightless/title";

@customElement("element-one")
export class ElementOne extends LitElement {
	static styles = [unsafeCSS(css)];

	@property({type: String}) headline: string;

	/**
	 * Renders the element.
	 */
	render () {
		return html`
			<wl-title level="4">${this.headline}</wl-title>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"element-one": ElementOne;
	}
}