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
* [➤ How to measure the data using Google Analytics?](#-how-to-measure-the-data-using-google-analytics)
* [➤ Contributors](#-contributors)
* [➤ License](#-license)


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#installation)

## ➤ Installation

```node
npm i @appnest/ab-test
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#usage)

## ➤ Usage

Use the `experiment()` function to add an experiment where you test one of multiple variations. The function takes an id of the experiment and an array of potential variations. The function optionally takes an instance of a `Test` class where the selected values will be added. If none is specified the function will use a global instance.

```typescript
import { experiment } from "@appnest/ab-test";

const headline = experiment("header.title.text", ["A/B testing", "A/B testing made simple", "Everyone should A/B test"]);
```

We want the headline to be the same next time the user reloads the page. To load the selected variations from local storage we use the `load()` function on the `test` object.

```typescript
import { test } from "@appnest/ab-test";

test.load();
```

To save the values to local storage we use the `save()` function.

```typescript
import { test } from "@appnest/ab-test";

test.save();
```

Ultimately we want to save the selected variations each time new experiments are added to the test. To do that we listen for the `update` event on the `test` object. It's also here we want to send information about the selected values to our analytics tools.

```typescript
import { Experiments, test, ExperimentEvent } from "@appnest/ab-test";

test.addEventListener(ExperimentEvent.UPDATE, (e: CustomEvent<Experiments>) => {
  test.save();
  console.log("TODO: Update analytics tools", e.detail);
});

test.load();
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#ab-test-web-components-using-lit-html)

## ➤ A/B test web components using lit-html

If you want to test different web components using [`lit-html`](https://github.com/Polymer/lit-html) you can use the `experimentElement()` function. This function is a lit directive that takes an id of the test and a map, mapping each tag name to its corresponding import function. Optionally it takes a map of properties that should be set on the element. If the element doesn't need an import simple pass the value null.

```typescript
import { customElement, html, LitElement } from "lit-element";
import { experiment, experimentElement } from "@appnest/ab-test";

@customElement("home-element")
export default class HomeElement extends LitElement {
  render () {
    return html`
      ${experimentElement("element", {
        "element-one": () => import("../elements/element-one"),
        "element-two": () => import("../elements/element-two")
      }, {
        headline: experiment("element.headline", ["A headline", "Another headline"])
      })}
    `;
  }
}
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#how-to-measure-the-data-using-google-analytics)

## ➤ How to measure the data using Google Analytics?

You can use many tools to measure the AB test. Google Analytics is a nice free choice. Start by going to [https://analytics.google.com/analytics/web/](https://analytics.google.com/analytics/web/) and create an account. Then add the tracking code to your `index.html` file.

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "UA-XXXXXXXX-X");
</script>
```

Now, let's say you want to AB test a title for the header. It can either be "Buy today" or "Get instant access". First you should define the title using the `experiment()` function, giving it an ID and an array with the two variations.

```typescript
import { experiment } from "@appnest/ab-test";

const title = experiment("header.title", ["Buy today", "Get instant access"]);
```

Add the title to the correct place in the header. Next you want send the data to Google Analytics. You can do that by using the global `gtag()` function and setting a dimension. We are going to create the dimension in Google Analytics in next step, but lets assume for now its `dimension1`. Since dimensions only take primitive values we stringify the object specifying the selected variations.

```typescript
import { Experiments, test, ExperimentEvent } from "@appnest/ab-test";

test.addEventListener(ExperimentEvent.UPDATE, (e: CustomEvent<Experiments>) => {
  test.save();
  gtag("set", "dimension1", JSON.stringify(e.detail));
});

test.load();
```

We now go to `Google Analytics → Admin → Property → Custom Definitions → Custom Dimensions` and create a custom dimension called `AB Test`. Remember that you cannot delete custom dimensions after they have been created and that you can have a maximum of 20 in each view. Therefore you can consider creating a new view for this purpose.

Next we go to `Google Analytics → Admin → View → Segments` and create two segments. We call the first segment for `AB Header Title 1` and the other segment for `AB Header Title 2`. In the first segment we go to the tab `Conditions` and add a filter that includes the `AB Test` dimension we created before if the dimension contains `"header.title.text":"Buy today"`. We do the same for the other segment but only includes the dimension if it contains `"header.title.text":"Get instant access"`.

Then we go to `Google Analytics → Admin → View → Goals` and create some goals that can capture conversions. That could for example be sign ups to the newsletter. Make sure to track this from your app since we need the data to figure out which variation is doing best.

Now we need to set up a view so we can figure out what variations are doing the best. Go to `Google Analytics → Customization → Custom Reports` and create a new report. Select the conversion rate of the goals you are measuring as your `Metric Groups`. The `Dimension Drilldowns` should be the `AB Test` dimension you created.

Go to the report you just created and select the two segments `AB Header Title 1` and `AB Header Title 2`. Click save and you are done! You will now be able to track which headline is doing best. Wait a couple of weeks and select the one that are doing best.

You should always try to only have one AB test going on at a given time.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#contributors)

## ➤ Contributors
	

| [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="You?" src="https://joeschmoe.io/api/v1/random" width="100">](https://github.com/andreasbm/web-router/blob/master/CONTRIBUTING.md) |
|:--------------------------------------------------:|:--------------------------------------------------:|
| [Andreas Mehlsen](https://twitter.com/andreasmehlsen) | [You?](https://github.com/andreasbm/web-router/blob/master/CONTRIBUTING.md) |


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#license)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).
