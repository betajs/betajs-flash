Scoped.define("module:FlashEmbedding", [ "base:Class", "base:Strings",
		"base:Async", "base:Functions", "base:Types" ], function(Class,
		Strings, Async, Functions, Types, scoped) {
	return Class.extend({
		scoped : scoped
	}, function(inherited) {
		return {

			constructor : function(embedding) {
				inherited.constructor.call(this);
				this.__embedding = embedding;
				this.__cache = {};
			},

			serialize : function(value) {
				return value;
			},

			unserialize : function(value) {
				if (Types.is_string(value)
						&& Strings.starts_with(value, "__FLASHERR__"))
					throw Strings.strip_start(value, "__FLASHERR__");
				return value;
			},

			invoke : function(method, args) {
				return this.unserialize(this.__embedding[method].apply(
						this.__embedding, this.serialize(args)));
			},

			invokeCached : function(method, args) {
				var key = method + "__"
						+ Functions.getArguments(args || []).join("__");
				if (!(key in this.__cache))
					this.__cache[key] = this.invoke.call(this, method, args);
				return this.__cache[key];
			},

			flashCreate : function() {
				return this.invoke("create", arguments);
			},

			flashDestroy : function() {
				return this.invoke("destroy", arguments);
			},

			flashCall : function() {
				return this.invoke("call", arguments);
			},

			flashCallVoid : function() {
				return this.invoke("call_void", arguments);
			},

			flashGet : function() {
				return this.invoke("get", arguments);
			},

			flashSet : function() {
				return this.invoke("set", arguments);
			},

			flashStaticCall : function() {
				return this.invoke("static_call", arguments);
			},

			flashStaticCallVoid : function() {
				return this.invoke("static_call_void", arguments);
			},

			flashGetStatic : function() {
				return this.invoke("get_static", arguments);
			},

			flashSetStatic : function() {
				return this.invoke("set_static", arguments);
			},

			flashAddEventListener : function() {
				return this.invoke("add_event_listener", arguments);
			},

			flashMain : function() {
				return this.invokeCached("main");
			},

			ready : function(callback, context) {
				Async.waitFor(this.flashMain, this, callback, context);
			}

		};
	});
});