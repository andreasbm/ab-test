/**
 * Returns a value clamped in between a min and a max value (inclusive).
 * @param value
 * @param min
 * @param max
 */
export function clamp (value: number, min: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}

/**
 * Copies the array.
 */
export function copyArray<T> (arr: T[]): T[] {
	return [...arr];
}
