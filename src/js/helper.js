Scoped.define("module:Helper", ["base:Time"], function (Time) {
	return {
		
		embedTemplate: function (flashFile, forceReload) {
			if (forceReload)
				flashFile += "?" + Time.now();
			return ('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">' +
						'<param name="movie" value="' + flashFile + '" />' +
						'<param name="quality" value="high" />' +
						'<param name="allowScriptAccess" value="always" />' +
						'<param name="wmode" value="opaque">' +
						'<embed ' +
							'src="' + flashFile + '" ' +
							'quality="high" wmode="opaque" align="middle" play="true" loop="false" allowScriptAccess="always" ' +
							'type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer">' +
						'</embed>' +
					'</object>');
		}		
	};
});