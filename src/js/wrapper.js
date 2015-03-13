Scoped.define("module:FlashObjectWrapper", [ "base:Class", "base:Objs", "base:Functions"  ], function(Class, Objs, Functions, scoped) {
	return Class.extend({
		scoped : scoped
	}, function(inherited) {
		return {

			constructor : function(embedding, objectIdent, objectType) {
				inherited.constructor.call(this);
				this.__embedding = embedding;
				this.__ident = objectIdent;
				this.__type = objectType;
				if (embedding.__registry) {
					Objs.iter(embedding.__registry.get(objectType), function (method) {
						this[method] = function () {
							var args = Functions.getArguments(arguments);
							args.unshift(method);
							args.unshift(this.__ident);
							return this.__embedding.flashCall.apply(this.__embedding, args);
						};
						this[method + "Void"] = function () {
							var args = Functions.getArguments(arguments);
							args.unshift(method);
							args.unshift(this.__ident);
							return this.__embedding.flashCallVoid.apply(this.__embedding, args);
						};
					}, this);
				}
			},
			
			destroy: function () {
				this.__embedding.flashDestroy(this.__ident);
				inherited.destroy.call(this);
			},
			
			addEventListener: function (ev, cb) {
				return this.__embedding.flashAddEventListener.call(this.__embedding, this.__ident, ev, cb);
			}

		};
	});
});