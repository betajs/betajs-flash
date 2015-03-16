Scoped.define("module:FlashClassRegistry", [ "base:Class" ], function(Class,
		scoped) {
	return Class.extend({
		scoped : scoped
	}, {

		interfaces : {},

		register : function(cls, methods, statics) {
			this.interfaces[cls] = {
				methods: methods || {},
				statics: statics || {}
			};
		},
		
		get: function (cls) {
			return this.interfaces[cls];
		}

	});
});
