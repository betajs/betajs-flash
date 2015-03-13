Scoped.define("module:FlashClassRegistry", [ "base:Class" ], function(Class,
		scoped) {
	return Class.extend({
		scoped : scoped
	}, {

		interfaces : {},

		register : function(cls, methods) {
			this.interfaces[cls] = methods;
		},
		
		get: function (cls) {
			return this.interfaces[cls] || {};
		}

	});
});
