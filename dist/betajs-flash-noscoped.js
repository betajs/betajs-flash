/*!
betajs-flash - v0.0.1 - 2015-03-13
Copyright (c) Oliver Friedmann
MIT Software License.
*/
(function () {

var Scoped = this.subScope();

Scoped.binding("module", "global:BetaJS.Flash");
Scoped.binding("base", "global:BetaJS");

Scoped.binding("jquery", "global:jQuery");

Scoped.define("module:", function () {
	return {
		guid: "3adc016a-e639-4d1a-b4cb-e90cab02bc4f",
		version: '1.1426286800672',
		__global: {}
	};
});

Scoped.define("module:FlashEmbedding", [ "base:Class", "base:Strings",
		"base:Async", "base:Functions", "base:Types", "base:Objs", "base:Ids", "module:__global", "module:FlashObjectWrapper" ], function(Class,
		Strings, Async, Functions, Types, Objs, Ids, moduleGlobal, FlashObjectWrapper, scoped) {
	return Class.extend({
		scoped : scoped
	}, function(inherited) {
		return {

			constructor : function(embedding, options) {
				inherited.constructor.call(this);
				this.__embedding = embedding;
				options = options || {};
				this.__registry = options.registry;
				this.__wrap = options.wrap;
				this.__cache = {};
				this.__callbacks = {};
				this.__wrappers = {};
				moduleGlobal[this.cid()] = this.__callbacks;
			},
			
			destroy: function () {
				delete moduleGlobal[this.cid()];
				Objs.iter(this.__wrappers, function (wrapper) {
					wrapper.destroy();
				});
				inherited.destroy.call(this);
			},
			
			registerCallback: function (callback, context) {
				var value = "__FLASHCALLBACK__" + Ids.uniqueId();
				this.__callbacks[value] = Functions.as_method(callback, context || this);
				return value;
			},
			
			unregisterCallback: function (value) {
				delete this.__callbacks[value];
			},
			
			serialize : function (value) {
				if (Types.is_array(value))
					return Objs.map(value, this.serialize, this);
				if (Types.is_function(value))
					value = this.registerCallback(value);
				if (Types.is_string(value)) {
					if (Strings.starts_with(value, "__FLASHCALLBACK__"))
						value = "BetaJS.Flash.__global." + this.cid() + "." + value;
				}
				if (FlashObjectWrapper.is_instance_of(value))
					value = value.__ident;
				return value;
			},

			unserialize : function(value) {
				if (Types.is_string(value) && Strings.starts_with(value, "__FLASHERR__"))
					throw Strings.strip_start(value, "__FLASHERR__");
				 if (Types.is_string(value) && this.__wrap && Strings.starts_with(value, "__FLASHOBJ__")) {
					if (!(value in this.__wrappers)) {
						var type = Strings.strip_start(value, "__FLASHOBJ__");
						type = Strings.splitFirst(type, "__").head.replace("::", ".");
						this.__wrappers[value] = new FlashObjectWrapper(this, value, type);
					}
					return this.__wrappers[value];
				}
				return value;
			},

			invoke : function(method, args) {
				args = args || [];
				return this.unserialize(this.__embedding[method].apply(this.__embedding, this.serialize(Functions.getArguments(args))));
			},

			invokeCached : function(method, args) {
				args = args || [];
				var key = method + "__" + Functions.getArguments(args).join("__");
				if (!(key in this.__cache))
					this.__cache[key] = this.invoke.call(this, method, args);
				return this.__cache[key];
			},
			
			newObject: function () {
				return this.flashCreate.apply(this, arguments);
			},
			
			flashCreate : function() {
				return this.invoke("create", arguments);
			},

			flashDestroy : function (obj) {
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
}).call(Scoped);