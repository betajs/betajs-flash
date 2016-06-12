# betajs-flash 0.0.15
[![Code Climate](https://codeclimate.com/github/betajs/betajs-flash/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-flash)


BetaJS-Flash is a Flash-JavaScript bridging framework



## Getting Started


You can use the library in the browser and compile it as well.

#### Browser

```javascript
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="betajs/dist/betajs.min.js"></script>
	<script src="betajs-browser/dist/betajs-browser.min.js"></script>
	<script src="betajs-flash/dist/betajs-flash.min.js"></script>
``` 

#### Compile

```javascript
	git clone https://github.com/betajs/betajs-flash.git
	npm install
	grunt
```



## Basic Usage


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



## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [http://betajs.com](http://betajs.com) |
| Git        | [git://github.com/betajs/betajs-flash.git](git://github.com/betajs/betajs-flash.git) |
| Repository | [http://github.com/betajs/betajs-flash](http://github.com/betajs/betajs-flash) |
| Blog       | [http://blog.betajs.com](http://blog.betajs.com) | 
| Twitter    | [http://twitter.com/thebetajs](http://twitter.com/thebetajs) | 



## Compatability
| Target | Versions |
| :----- | -------: |
| Firefox | 4 - Latest |
| Chrome | 18 - Latest |
| Safari | 5 - Latest |
| Opera | 18 - Latest |
| Internet Explorer | 8 - Latest |
| Edge | 12 - Latest |


## CDN
| Resource | URL |
| :----- | -------: |
| betajs-flash.js | [http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash.js](http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash.js) |
| betajs-flash.min.js | [http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash.min.js](http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash.min.js) |
| betajs-flash-noscoped.js | [http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash-noscoped.js](http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash-noscoped.js) |
| betajs-flash-noscoped.min.js | [http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash-noscoped.min.js](http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash-noscoped.min.js) |
| betajs-flash.swf | [http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash.swf](http://cdn.rawgit.com/betajs/betajs-flash/master/dist/betajs-flash.swf) |


## Unit Tests
| Resource | URL |
| :----- | -------: |
| Test Suite | [Run](http://rawgit.com/betajs/betajs-flash/master/tests/tests.html) |


## Dependencies
| Name | URL |
| :----- | -------: |
| betajs | [Open](https://github.com/betajs/betajs) |
| betajs-browser | [Open](https://github.com/betajs/betajs-browser) |


## Weak Dependencies
| Name | URL |
| :----- | -------: |
| betajs-scoped | [Open](https://github.com/betajs/betajs-scoped) |


## Contributors

- Ziggeo
- Oliver Friedmann


## License

Apache-2.0


## Credits

This software may include modified and unmodified portions of:
- AS3CoreLib, BSD License, (c) 2008, Adobe Systems Incorporated
