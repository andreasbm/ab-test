/**
 * Determines whether the key is a css property.
 * @param key
 */
export function isCssProperty (key: string) {
	return key.startsWith("--");
}
