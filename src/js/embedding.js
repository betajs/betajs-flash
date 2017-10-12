Scoped.extend("module:", ["module:"], function () {
	return {
		options: {
			flashFile: "betajs-flash.swf"			
		}
	};
});

Scoped.define("module:FlashEmbedding", [
	"base:Class", "base:Events.EventsMixin", "browser:Dom", "base:Strings", "base:Functions", "base:Types", "base:Objs", "base:Ids", "base:Time",
	"base:Timers.Timer", "base:Async", "base:Tokens", "module:FlashObjectWrapper", "module:FlashClassWrapper", "browser:FlashHelper", "module:"
], function(Class, EventsMixin, Dom, Strings, Functions, Types, Objs, Ids, Time, Timer, Async, Tokens, FlashObjectWrapper, FlashClassWrapper, FlashHelper, mod, scoped) {
	return Class.extend({ scoped : scoped }, [EventsMixin, function(inherited) {
		return {

			constructor : function(container, options, flashOptions) {
				inherited.constructor.call(this);
				options = options || {};
				this.__registry = options.registry;
				this.__wrap = options.wrap;
				this.__hasEmbedding = options.hasEmbedding;
				this.__cache = {};
				this.__callbacks = {
					ready: Functions.as_method(this.__ready, this)
				};
				this.__namespace = options.namespace ? options.namespace : ("flash_" + Tokens.generate_token());
				this.__is_ready = false;
				this.__is_suspended = false;
				this.__throttle_status = "";
				this.__ready_queue = [];
				this.__wrappers = {};
				this.__staticWrappers = {};
				window[this.__namespace] = this.__callbacks;
				flashOptions = Objs.extend(Objs.clone(mod.options, 1), Objs.extend({
					FlashVars: {}
				}, flashOptions));
				flashOptions.FlashVars.ready = this.__namespace + ".ready";
				if (options.debug)
					flashOptions.FlashVars.debug = true;
				if (!container) {
					this.__helper_container = true;
					container = document.createElement("div");
					container.style.width = "1px";
					container.style.height = "1px";
					container.style.visibility = "hidden";
					container.style.position = "absolute";
					container.style.zIndex = -1;
					document.body.appendChild(container);
				}
				this.__container = Dom.unbox(container);
				this.__embedding = options.hasEmbedding ? FlashHelper.getFlashObject(this.__container) : FlashHelper.embedFlashObject(this.__container, flashOptions);
				this.__suspendedTimer = this.auto_destroy(new Timer({
					delay: 50,
					context: this,
					fire: this.__suspendedCheck
				}));
			},
			
			destroy: function () {
				try {
					window[this.__namespace] = null;
					delete window[this.__namespace];
				} catch (e) {}
				Objs.iter(this.__wrappers, function (wrapper) {
					wrapper.weakDestroy();
				});
				Objs.iter(this.__staticWrappers, function (wrapper) {
					wrapper.weakDestroy();
				});
				if (!this.__hasEmbedding) {
                    this.__container.innerHTML = "";
                    if (this.__helper_container)
                        this.__container.parentNode.removeChild(this.__container);
				}
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
					while (tries > 0) {
						try {
							if (this.__embedding.echo(test) == test)
								break;
						} catch (e) {}
						tries--;
					}
					var result = tries === 0;
					if (result !== this.__is_suspended) {
						this.__is_suspended = result;
						this.trigger(result ? "suspended" : "resumed");
					}
					try {
						var status = this.__embedding.throttle();
						var changed = status !== this.__throttle_status;
						this.__throttle_status = status;
						if (changed)
							this.trigger(this.isThrottled() ? "throttled" : "unthrottled");
					} catch (e) {}
				}
			},
			
			isSuspended: function () {
				return this.__is_ready && this.__is_suspended;
			},

			isThrottled: function () {
				return this.__throttle_status === "throttle";
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