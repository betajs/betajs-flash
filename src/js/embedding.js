Scoped.define("module:FlashEmbedding", [ "base:Class", "base:Events.EventsMixin", "jquery:", "base:Strings",
		"base:Functions", "base:Types", "base:Objs", "base:Ids", "base:Time", "base:Timers.Timer", "base:Async", "module:__global",
		"module:FlashObjectWrapper", "module:FlashClassWrapper", "base:Browser.FlashHelper", "module:" ], function(Class, EventsMixin, $,
		Strings, Functions, Types, Objs, Ids, Time, Timer, Async, moduleGlobal, FlashObjectWrapper, FlashClassWrapper, FlashHelper, mod, scoped) {
	return Class.extend({
		scoped : scoped
	}, [EventsMixin, function(inherited) {
		return {

			constructor : function(container, options, flashOptions) {
				inherited.constructor.call(this);
				options = options || {};
				this.__registry = options.registry;
				this.__wrap = options.wrap;
				this.__cache = {};
				this.__callbacks = {
					ready: Functions.as_method(this.__ready, this)
				};
				this.__namespace = "BetaJS.Flash.__global." + this.cid();
				this.__is_ready = false;
				this.__is_suspended = false;
				this.__ready_queue = [];
				this.__wrappers = {};
				this.__staticWrappers = {};
				moduleGlobal[this.cid()] = this.__callbacks;
				flashOptions = Objs.extend(Objs.clone(mod.options, 1), Objs.extend({
					FlashVars: {}
				}, flashOptions));
				flashOptions.FlashVars.ready = this.__namespace + ".ready";
				if (options.debug)
					flashOptions.FlashVars.debug = true;
				this.__embedding = FlashHelper.embedFlashObject(container, flashOptions);
				this.__suspendedTimer = this.auto_destroy(new Timer({
					delay: 50,
					context: this,
					fire: this.__suspendedCheck
				}));
			},
			
			destroy: function () {
				delete moduleGlobal[this.cid()];
				Objs.iter(this.__wrappers, function (wrapper) {
					wrapper.destroy();
				});
				Objs.iter(this.__staticWrappers, function (wrapper) {
					wrapper.destroy();
				});
				inherited.destroy.call(this);
			},
			
			registerCallback: function (callback, context) {
				var value = "__FLASHCALLBACK__" + Ids.uniqueId();
				var self = this;
				this.__callbacks[value] = function () {
					callback.apply(context || self, Objs.map(Functions.getArguments(arguments), self.unserialize, self));
				};
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
						value = this.__namespace + "." + value;
				}
				if (FlashObjectWrapper.is_instance_of(value))
					value = value.__ident;
				if (FlashClassWrapper.is_instance_of(value))
					value = value.__type;
				return value;
			},

			unserialize : function(value) {
				if (Types.is_string(value) && Strings.starts_with(value, "__FLASHERR__"))
					throw Strings.strip_start(value, "__FLASHERR__");
				 if (Types.is_string(value) && Strings.starts_with(value, "__FLASHOBJ__")) {
					 if (this.__wrap) {
						var type = Strings.strip_start(value, "__FLASHOBJ__");
						type = Strings.splitFirst(type, "__").head.replace("::", ".");
						if (type.toLowerCase() != "object") {
							if (!(value in this.__wrappers))
								this.__wrappers[value] = new FlashObjectWrapper(this, value, type);
							return this.__wrappers[value];
						}
					 }
				}
				return value;
			},

			invoke : function(method, args) {
				if (!this.__is_ready)
					throw "Flash is not ready yet";
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
			
			getClass: function (className) {
				if (!this.__wrap)
					return null;
				if (!(className in this.__staticWrappers))
					this.__staticWrappers[className] = new FlashClassWrapper(this, className);
				return this.__staticWrappers[className];
			},
			
			newObject: function () {
				return this.flashCreate.apply(this, arguments);
			},
			
			newCallback: function () {
				return Types.is_string(arguments[0]) ? this.flashCreateCallbackObject.apply(this, arguments) : this.flashCreateCallbackFunction.apply(this, arguments);
			},
			
			flashCreateCallbackObject : function() {
				return this.invoke("create_callback_object", arguments);
			},
			
			flashCreateCallbackFunction : function() {
				return this.invoke("create_callback_function", arguments);
			},

			flashCreate : function() {
				return this.invoke("create", arguments);
			},

			flashDestroy : function () {
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

			flashMain : function() {
				return this.invokeCached("main");
			},
			
			__suspendedCheck: function () {
				if (this.__is_ready) {
					var test = Time.now();
					var tries = 10;
					while (this.__embedding.echo(test) !== test && tries > 0)
						tries--;
					var result = tries === 0;
					if (result !== this.__is_suspended) {
						this.__is_suspended = result;
						this.trigger(result ? "suspended" : "resumed");
					}
				}
			},
			
			isSuspended: function () {
				return this.__is_ready && this.__is_suspended;
			},
			
			__ready: function () {
				if (!this.__is_ready) {
					this.__is_ready = true;
					this.__is_suspended = false;
					Async.eventually(function () {
						Objs.iter(this.__ready_queue, function (entry) {
							entry.callback.call(entry.context || this);
						}, this);
					}, this);
					this.trigger("ready");
				}
			},

			ready : function(callback, context) {
				if (this.__is_ready) {
					Async.eventually(function () {
						callback.call(context || this);
					}, this);
				} else {
					this.__ready_queue.push({
						callback: callback,
						context: context
					});
				}
			}

		};
	}]);
});