import { directive, NodePart, Part } from "lit-html";
import { getTest } from "../ab-test/test";
import { ElementImporter, ITest, Properties } from "../typings";
import { setProperties } from "../util/set-properties";

const partCache = new WeakMap<NodePart, HTMLElement>();

/**
 * Selects a random element and adds it to the DOM.
 */
export const experimentElement = directive((
	id: string,
	variations: {[tagName: string]: ElementImporter | null},
	properties: Properties = {},
	test: ITest = getTest()) => async (part: Part) => {

	// Make sure the part is used within a text binding context.
	if (!(part instanceof NodePart)) {
		throw new Error(`experimentElement can only be used in text bindings`);
	}

	// If this part already has an instantiated element we
	// need to check if the test ID still have a value set.
	// If the test no longer has an experiment ID we remove the
	// instantiated element to create a new one.
	if (partCache.has(part)) {
		const $element = partCache.get(part)!;
		if (test.has(id)) {
			setProperties($element, properties);
			return;

		} else {
			$element.remove();
		}
	}

	// Either get the tag name from the experiment or pick a new variation.
	const [tagName, importer] = test.has(id)
		? [test.get(id), variations[test.get<string>(id) || ""]]
		: test.getVariation(Object.entries(variations));

	// Import the element if an importer was specified.
	if (importer != null) {
		await Promise.resolve(importer());
	}

	// Create a new element, set the properties and add it to the DOM.
	const $element = document.createElement(tagName);
	setProperties($element, properties);
	partCache.set(part, $element);
	test.set(id, tagName);

	// Insert the node into the DOM.
	part.endNode.parentNode!.insertBefore($element, part.endNode);
	part.commit();
});


