<h1 align="center">@appnest/ab-test</h1>
<p align="center">
  <b>A/B testing made incredible simple</b></br>
  <sub>Never be happy with your conversion rate. Just remember that every page can be better. This library makes A/B testing incredible simple and works very well with web components. Go here to see a demo <a href="https://appnest-demo.firebaseapp.com/ab-test">https://appnest-demo.firebaseapp.com/ab-test</a>.<sub>
</p>

<br />

<p align="center">
		<a href="https://npmcharts.com/compare/@appnest/ab-test?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@appnest/ab-test.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@appnest/ab-test"><img alt="NPM Version" src="https://img.shields.io/npm/v/@appnest/ab-test.svg" height="20"/></a>
<a href="https://david-dm.org/andreasbm/ab-test"><img alt="Dependencies" src="https://img.shields.io/david/andreasbm/ab-test.svg" height="20"/></a>
<a href="https://github.com/andreasbm/ab-test/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/andreasbm/ab-test.svg" height="20"/></a>
	</p>


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)

## ➤ Table of Contents

* [➤ Installation](#-installation)
* [➤ Usage](#-usage)
* [➤ A/B test web components using lit-html](#-ab-test-web-components-using-lit-html)
* [➤ Contributors](#-contributors)
* [➤ License](#-license)


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#installation)

## ➤ Installation

```node
npm i @appnest/ab-test
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#usage)

## ➤ Usage

Use the `abTest()` function to add a test where you test one of multiple variations. The function takes an id of the test and an array of potential variations. The function optionally takes an instance of an `Experiment` class where the selected values will be added. If none is specified the function will use a global instance.

```typescript
import { abTest } from "@appnest/ab-test";

const headline = abTest("header.title.text", ["A/B testing", "A/B testing made simple", "Everyone should A/B test"]);
```

Get notified by the selected test values by listening to the `update` event of the experiment. Use this event to send the information to your analytics.

```typescript
import { Tests, experiment } from "@appnest/ab-test";

experiment.addEventListener("update", (e: CustomEvent<Tests>) => {
  experiment.save();
  console.log("Update analytics tool", e.detail);
  gtag("set", e.detail);
});

experiment.load();
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#ab-test-web-components-using-lit-html)

## ➤ A/B test web components using lit-html

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


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#contributors)

## ➤ Contributors
	

| [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="You?" src="https://joeschmoe.io/api/v1/random" width="100">](https://github.com/andreasbm/web-router/blob/master/CONTRIBUTING.md) |
|:--------------------------------------------------:|:--------------------------------------------------:|
| [Andreas Mehlsen](https://twitter.com/andreasmehlsen) | [You?](https://github.com/andreasbm/web-router/blob/master/CONTRIBUTING.md) |


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#license)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).
