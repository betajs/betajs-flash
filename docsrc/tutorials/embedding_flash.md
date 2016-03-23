Once the registry is defined, we need to add our Flash embedding to the DOM.

We assume a container element like the following one:

```html
    <div id='embed-here'></div>
```

We can then embed Flash as follows:


```javascript
	var embedding = new BetaJS.Flash.FlashEmbedding($("#embed-here").get(0), {
		registry: registry,
		wrap: true
	}, {
		flashFile: "betajs-flash/dist/betajs-flash.swf"
	});
```

This call embeds a Flash embedding within the given container, using the `registry` we defined previously, and linking to general Flash bridging file.

Before accessing the embedding, we have to wait for the ready event:

```javascript
	embedding.ready(function () {
		// Execute Flash functions on the embedding.
	});
```
