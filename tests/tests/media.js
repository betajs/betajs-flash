QUnit.test("test playback mp4", function(assert) {
	var flashFile = window.BrowserStack ? "//files.betajs.com/betajs-flash.swf" : "../dist/betajs-flash.swf";
	var videoFile = window.BrowserStack ? "http://files.betajs.com/movie.mp4" : document.location + "/../tests/movie.mp4";
	var done = assert.async();
	var registry = new BetaJS.Flash.FlashClassRegistry();
	registry.register("flash.media.Video", ["attachNetStream"]);
	registry.register("flash.display.Sprite", ["addChild"]);
	registry.register("flash.net.NetStream", ["play", "addEventListener"]);
	registry.register("flash.net.NetConnection", ["connect", "addEventListener"]);
	var embedding = new BetaJS.Flash.FlashEmbedding(document.getElementById("visible-fixture"), {
		registry: registry,
		wrap: true
	}, {
		flashFile: flashFile,
		forceReload: true
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
			stream.set("client", embedding.newCallback("onMetaData", function (info) {
                assert.equal(info.width, 640);
                assert.equal(info.height, 360);
				done();
				embedding.destroy();
			}));
			
			stream.addEventListener("netStatus", embedding.newCallback(function (event) {
			}));
			
			video.attachNetStreamVoid(stream);
			stream.playVoid(videoFile);
		});
		connection.addEventListener("netStatus", cb);
		connection.connectVoid(null);
	});
});
