```js

	var registry = new BetaJS.Flash.FlashClassRegistry();
	registry.register("flash.media.Video", ["attachNetStream"]);
	registry.register("flash.display.Sprite", ["addChild"]);
	registry.register("flash.net.NetStream", ["play", "addEventListener"]);
	registry.register("flash.net.NetConnection", ["connect", "addEventListener"]);

	var embedding = new BetaJS.Flash.FlashEmbedding($("#embed-here").get(0), {
		registry: registry,
		wrap: true
	}, {
		flashFile: "betajs-flash/dist/betajs-flash.swf"
	});
	
	embedding.ready(function () {
		var main = embedding.flashMain();
		var stage = main.get("stage");
		stage.set("scaleMode", "noScale");
		stage.set("align", "TL");
		var video = embedding.newObject("flash.media.Video", stage.get("stageWidth"), stage.get("stageHeight"));
		main.addChildVoid(video);
		var connection = embedding.newObject("flash.net.NetConnection");
		var cb = embedding.newCallback(function () {
			var stream = embedding.newObject("flash.net.NetStream", connection);
			video.attachNetStreamVoid(stream);
			stream.playVoid("movie.mp4");
		});
		connection.addEventListener("netStatus", cb);
		connection.connectVoid(null);
	});
```

```html

    <div id='embed-here'></div>

```
