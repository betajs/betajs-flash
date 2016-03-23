In order to be able to instantiate Flash objects and call methods on these objects, we need to create a `Flash Registry` and register all the entities that we want to call:

```javascript
	var registry = new BetaJS.Flash.FlashClassRegistry();
	registry.register("flash.media.Video", ["attachNetStream"]);
	registry.register("flash.display.Sprite", ["addChild"]);
	registry.register("flash.net.NetStream", ["play", "addEventListener"]);
	registry.register("flash.net.NetConnection", ["connect", "addEventListener"]);
```

In this example, we register the classes `flash.media.Video`, `flash.display.Sprite`, `flash.net.NetStream` and `flash.net.NetConnection`,
and on those classes the instance methods `attachNetStream`, `addChild`, `play`, `addEventListener` and `connect`.

It suffices to only register the methods you are intending to call.