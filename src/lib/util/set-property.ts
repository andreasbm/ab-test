import { isCssProperty } from "./is-css-property";

/**
 * Updates the property of an element.
 * @param $element
 * @param key
 * @param value
 */
export function setProperty ($element: HTMLElement, key: string, value: unknown) {
	if (isCssProperty(key)) {
		if (value == null) {
			$element.style.removeProperty(key);
		} else {
			$element.style.setProperty(key, value as string);
		}

	} else if (($element as any)[key] != value) {
		($element as any)[key] = value;
	}
}
