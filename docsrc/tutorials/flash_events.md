Many Flash objects provide so-called `Event Listeners`. The framework allows to create callbacks in JavaScript, that can be passed in as `Event Listeners`:

```javascript
	var connection = embedding.newObject("flash.net.NetConnection");
	var cb = embedding.newCallback(function () {
		var stream = embedding.newObject("flash.net.NetStream", connection);
		video.attachNetStreamVoid(stream);
		stream.playVoid("movie.mp4");
	});
	connection.addEventListener("netStatus", cb);
	connection.connectVoid(null);
```