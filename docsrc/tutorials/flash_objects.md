Once the embedding is ready, we can instantiate objects, call methods and access properties as we normally would in Flash.

Note that you can only access objects and method defined in the registry.

```javascript
	var main = embedding.flashMain();
	var stage = main.get("stage");
	stage.set("scaleMode", "noScale");
	stage.set("align", "TL");
	var video = embedding.newObject("flash.media.Video", stage.get("stageWidth"), stage.get("stageHeight"));
	main.addChildVoid(video);
```