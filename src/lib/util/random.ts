/**
 * Returns a random number in a range (inclusive).
 * @param from
 * @param to
 */
export function randomNumberInRange (from: number, to: number): number {
	return Math.floor(Math.random() * (to - from + 1)) + from;
}

/**
 * Returns a random item from a list.
 * @param list
 */
export function randomItemFromList<T> (list: Array<T>): T | null {
	if (list.length === 0) return null;
	return list[randomNumberInRange(0, list.length - 1)];
}

