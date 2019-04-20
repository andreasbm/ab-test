import { directive, NodePart, Part } from "lit-html";
import { getExperiment } from "../experiment/experiment";
import { ElementImporter, IExperiment, Properties, Variations } from "../typings";
import { setProperties } from "../util/set-properties";

const partCache = new WeakMap<NodePart, HTMLElement>();

/**
 * Selects a random element and adds it to the DOM.
 */
export const abElement = directive((
	id: string,
	elements: Variations<string>,
	properties: Properties = {},
	importMap: {[tagName: string]: ElementImporter} = {},
	experiment: IExperiment = getExperiment()) => async (part: Part) => {

	// Make sure the part is used within a text binding context.
	if (!(part instanceof NodePart)) {
		throw new Error(`abTestElement can only be used in text bindings`);
	}

	// If this part already has an instantiated element we
	// need to check if the test ID still have a value set.
	// If the experiment no longer has a test ID we remove the
	// instantiated element to create a new one.
	if (partCache.has(part)) {
		const $element = partCache.get(part)!;
		if (experiment.has(id)) {
			setProperties($element, properties);
			return;

		} else {
			$element.remove();
		}
	}

	// Either get the tag name from the experiment or pick a new variation.
	const tagName = experiment.get(id) as string || experiment.getVariation(elements)!;
	const importer = importMap[tagName];

	// Import the element if an importer was specified.
	if (importer != null) {
		await Promise.resolve(importer);
	}

	// Create a new element, set the properties and add it to the DOM.
	const $element = document.createElement(tagName as string);
	setProperties($element, properties);
	partCache.set(part, $element);
	experiment.set(id, tagName);

	// Insert the node into the DOM.
	part.endNode.parentNode!.insertBefore($element, part.endNode);
	part.commit();
});


