{{ template:title }}
{{ template:description }}

## Installation

```node
npm i @appnest/ab-test
```

## Usage

Use the `abTest()` function to add a test where you test one of multiple variations. The function takes an id of the test and an array of potential variations. The function optionally takes an instance of an `Experiment` class where the selected values will be added. If none is specified the function will use a global instance.

```typescript
import { abTest } from "@appnest/ab-test";

const headline = abTest("header.title.text", ["A/B testing", "A/B testing made simple", "Everyone should A/B test"]);
```

Get notified by the selected test values by listening to the `update` event of the experiment. Use this event to send the information to your analytics.

```typescript
import { Tests, getExperiment } from "@appnest/ab-test";

getExperiment().addEventListener("update", (e: CustomEvent<Tests>) => {
  console.log("Update analytics tool", e.detail);
  window.dataLayer.push(e.detail);
});
```

## A/B test web components using lit-html

If you want to test different web components using [`lit-html`](https://github.com/Polymer/lit-html) you can use the `abElement()` function. This function is a lit directive and takes an id of the test and a map, mapping each tag name to its corresponding import function. Optionally it takes a map of properties that should be set on the element. If the element doesn't need an import simple pass the value null.

```typescript
import { customElement, html, LitElement } from "lit-element";
import { abElement, abTest } from "@appnest/ab-test";

@customElement("home-element")
export default class HomeElement extends LitElement {
  render () {
    return html`
      ${abElement("element", {
        "element-one": () => import("../elements/element-one/element-one"),
        "element-two": () => import("../elements/element-two/element-two")
      }, {
        headline: abTest("element.headline", ["These are the values", "Check out the values below"])
      })}
    `;
  }
}
```

{{ template:contributors }}
{{ template:license }}