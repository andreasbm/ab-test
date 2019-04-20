import { Properties } from "../typings";
import { setProperty } from "./set-property";

/**
 * Set properties of an element.
 * @param $element
 * @param properties
 */
export function setProperties ($element: HTMLElement, properties: Properties) {
	for (const [key, value]of Object.entries(properties)) {
		setProperty($element, key, value);
	}
}
