import { copyArray } from "./helper";

/**
 * Returns a random number in a range (inclusive).
 * @param from
 * @param to
 */
export function randomNumberInRange (from: number, to: number): number {
	return Math.floor(Math.random() * (to - from + 1)) + from;
}

/**
 * Flips a coin.
 * @param chance - The chance of the coin toss to turn out true.
 */
export function flipCoin (chance: number = 0.5) {
	return randomNumberInRange(0, 100) >= (1 - chance) * 100;
}

/**
 * Returns a random item from a list.
 * @param list
 */
export function randomItemFromList<T> (list: Array<T>): T | null {
	if (list.length === 0) return null;
	return list[randomNumberInRange(0, list.length - 1)];
}

/**
 * Returns a weighted random item based on the weight.
 * The higher the weight, the more likely the item is to be chosen.
 * @param items
 * @param getWeight
 */
export function weightedRandomItem<T> (items: T[], getWeight: ((item: T) => number)): T | null {
	if (items.length === 0) return null;

	const totalWeight = items.reduce(((acc: number, item: T) => acc + getWeight(item)), 0);
	let random = randomNumberInRange(1, totalWeight);
	const weightedRandomItem = items.find(item => {
		random -= getWeight(item);
		return random <= 0;
	});

	// Return the item that was found. If the item is null, a completely random item is chosen.
	return weightedRandomItem != null ? weightedRandomItem : randomItemFromList(items);
}


/**
 * Randomly shuffles an array based on the weights.
 * @param items
 * @param getWeight
 * @param maxLength
 */
export function weightedShuffle<T> (items: T[], getWeight: ((item: T) => number), maxLength?: number): T[] {
	items = copyArray(items).slice(0);
	const shuffledItems = [];

	while (items.length > 0 && (maxLength != null ? shuffledItems.length < maxLength : true)) {
		const randomItem = weightedRandomItem(items, getWeight)!;
		shuffledItems.push(randomItem);
		items.splice(items.indexOf(randomItem), 1);
	}

	return shuffledItems;
}

