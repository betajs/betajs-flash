/*!
betajs-flash - v0.0.1 - 2015-03-24
Copyright (c) Oliver Friedmann
MIT Software License.
*/
/*!
betajs-scoped - v0.0.1 - 2015-03-17
Copyright (c) Oliver Friedmann
MIT Software License.
*/
var Scoped = (function () {
var Globals = {

	get : function(key) {
		if (typeof window !== "undefined")
			return window[key];
		if (typeof global !== "undefined")
			return global[key];
		return null;
	},

	set : function(key, value) {
		if (typeof window !== "undefined")
			window[key] = value;
		if (typeof global !== "undefined")
			global[key] = value;
		return value;
	},
	
	setPath: function (path, value) {
		var args = path.split(".");
		if (args.length == 1)
			return this.set(path, value);		
		var current = this.get(args[0]) || this.set(args[0], {});
		for (var i = 1; i < args.length - 1; ++i) {
			if (!(args[i] in current))
				current[args[i]] = {};
			current = current[args[i]];
		}
		current[args[args.length - 1]] = value;
		return value;
	},
	
	getPath: function (path) {
		var args = path.split(".");
		if (args.length == 1)
			return this.get(path);		
		var current = this.get(args[0]);
		for (var i = 1; i < args.length; ++i) {
			if (!current)
				return current;
			current = current[args[i]];
		}
		return current;
	}

};
var Helper = {
		
	method: function (obj, func) {
		return function () {
			return func.apply(obj, arguments);
		};
	},
	
	extend: function (base, overwrite) {
		base = base || {};
		overwrite = overwrite || {};
		for (var key in overwrite)
			base[key] = overwrite[key];
		return base;
	},
	
	typeOf: function (obj) {
		return Object.prototype.toString.call(obj) === '[object Array]' ? "array" : typeof obj;
	},
	
	isEmpty: function (obj) {
		if (obj === null || typeof obj === "undefined")
			return true;
		if (this.typeOf(obj) == "array")
			return obj.length === 0;
		if (typeof obj !== "object")
			return false;
		for (var key in obj)
			return false;
		return true;
	},
	
	matchArgs: function (args, pattern) {
		var i = 0;
		var result = {};
		for (var key in pattern) {
			if (pattern[key] === true || this.typeOf(args[i]) == pattern[key]) {
				result[key] = args[i];
				i++;
			} else if (this.typeOf(args[i]) == "undefined")
				i++;
		}
		return result;
	},
	
	stringify: function (value) {
		if (this.typeOf(value) == "function")
			return "" + value;
		return JSON.stringify(value);
	}	

};
var Attach = {
		
	__namespace: "Scoped",
	
	upgrade: function (namespace) {
		var current = Globals.get(namespace || Attach.__namespace);
		if (current && Helper.typeOf(current) == "object" && current.guid == this.guid && Helper.typeOf(current.version) == "string") {
			var my_version = this.version.split(".");
			var current_version = current.version.split(".");
			var newer = false;
			for (var i = 0; i < Math.min(my_version.length, current_version.length); ++i) {
				newer = my_version[i] > current_version[i];
				if (my_version[i] != current_version[i]) 
					break;
			}
			return newer ? this.attach(namespace) : current;				
		} else
			return this.attach(namespace);		
	},

	attach : function(namespace) {
		if (namespace)
			Attach.__namespace = namespace;
		var current = Globals.get(Attach.__namespace);
		if (current == this)
			return this;
		Attach.__revert = current;
		Globals.set(Attach.__namespace, this);
		return this;
	},
	
	detach: function (forceDetach) {
		if (forceDetach)
			Globals.set(Attach.__namespace, null);
		if (typeof Attach.__revert != "undefined")
			Globals.set(Attach.__namespace, Attach.__revert);
		delete Attach.__revert;
		return this;
	},
	
	exports: function (mod, object, forceExport) {
		mod = mod || (typeof module != "undefined" ? module : null);
		if (typeof mod == "object" && mod && "exports" in mod && (forceExport || mod.exports == this || !mod.exports || Helper.isEmpty(mod.exports)))
			mod.exports = object || this;
		return this;
	}	

};

function newNamespace (options) {
	
	options = Helper.extend({
		tree: false,
		global: false,
		root: {}
	}, options);
	
	function initNode(options) {
		return Helper.extend({
			route: null,
			parent: null,
			children: {},
			watchers: [],
			data: {},
			ready: false,
			lazy: []
		}, options);
	}
	
	var nsRoot = initNode({ready: true});
	
	var treeRoot = null;
	
	if (options.tree) {
		if (options.global) {
			try {
				if (window)
					treeRoot = window;
			} catch (e) { }
			try {
				if (global)
					treeRoot = global;
			} catch (e) { }
		} else
			treeRoot = options.root;
		nsRoot.data = treeRoot;
	}
	
	function nodeDigest(node) {
		if (node.ready)
			return;
		if (node.parent && !node.parent.ready) {
			nodeDigest(node.parent);
			return;
		}
		if (node.route in node.parent.data) {
			node.data = node.parent.data[node.route];
			node.ready = true;
			for (var i = 0; i < node.watchers.length; ++i)
				node.watchers[i].callback.call(node.watchers[i].context || this, node.data);
			node.watchers = [];
			for (var key in node.children)
				nodeDigest(node.children[key]);
		}
	}
	
	function nodeEnforce(node) {
		if (node.ready)
			return;
		if (node.parent && !node.parent.ready)
			nodeEnforce(node.parent);
		node.ready = true;
		if (options.tree && typeof node.parent.data == "object")
			node.parent.data[node.route] = node.data;
		for (var i = 0; i < node.watchers.length; ++i)
			node.watchers[i].callback.call(node.watchers[i].context || this, node.data);
		node.watchers = [];
	}
	
	function nodeSetData(node, value) {
		if (typeof value == "object") {
			for (var key in value) {
				node.data[key] = value[key];
				if (node.children[key])
					node.children[key].data = value[key];
			}
		} else
			node.data = value;
		nodeEnforce(node);
		for (var k in node.children)
			nodeDigest(node.children[k]);
	}
	
	function nodeClearData(node) {
		if (node.ready && node.data) {
			for (var key in node.data)
				delete node.data[key];
		}
	}
	
	function nodeNavigate(path) {
		if (!path)
			return nsRoot;
		var routes = path.split(".");
		var current = nsRoot;
		for (var i = 0; i < routes.length; ++i) {
			if (routes[i] in current.children)
				current = current.children[routes[i]];
			else {
				current.children[routes[i]] = initNode({
					parent: current,
					route: routes[i]
				});
				current = current.children[routes[i]];
				nodeDigest(current);
			}
		}
		return current;
	}
	
	function nodeAddWatcher(node, callback, context) {
		if (node.ready)
			callback.call(context || this, node.data);
		else {
			node.watchers.push({
				callback: callback,
				context: context
			});
			if (node.lazy.length > 0) {
				var f = function (node) {
					if (node.lazy.length > 0) {
						var lazy = node.lazy.shift();
						lazy.callback.call(lazy.context || this, node.data);
						f(node);
					}
				};
				f(node);
			}
		}
	}

	return {
		
		extend: function (path, value) {
			nodeSetData(nodeNavigate(path), value);
		},
		
		set: function (path, value) {
			var node = nodeNavigate(path);
			if (node.data)
				nodeClearData(node);
			nodeSetData(node, value);
		},
		
		lazy: function (path, callback, context) {
			var node = nodeNavigate(path);
			if (node.ready)
				callback(context || this, node.data);
			else {
				node.lazy.push({
					callback: callback,
					context: context
				});
			}
		},
		
		digest: function (path) {
			nodeDigest(nodeNavigate(path));
		},
		
		obtain: function (path, callback, context) {
			nodeAddWatcher(nodeNavigate(path), callback, context);
		}
		
	};
	
}
function newScope (parent, parentNamespace, rootNamespace, globalNamespace) {
	
	var self = this;
	var nextScope = null;
	var childScopes = [];
	var localNamespace = newNamespace({tree: true});
	var privateNamespace = newNamespace({tree: false});
	
	var bindings = {
		"global": {
			namespace: globalNamespace
		}, "root": {
			namespace: rootNamespace
		}, "local": {
			namespace: localNamespace
		}, "default": {
			namespace: privateNamespace
		}, "parent": {
			namespace: parentNamespace
		}, "scope": {
			namespace: localNamespace,
			readonly: false
		}
	};
	
	var custom = function (argmts, name, callback) {
		var args = Helper.matchArgs(argmts, {
			options: "object",
			namespaceLocator: true,
			dependencies: "array",
			hiddenDependencies: "array",
			callback: true,
			context: "object"
		});
		
		var options = Helper.extend({
			lazy: this.options.lazy
		}, args.options || {});
		
		var ns = this.resolve(args.namespaceLocator);
		
		var execute = function () {
			this.require(args.dependencies, args.hiddenDependencies, function () {
				arguments[arguments.length - 1].ns = ns;
				if (this.options.compile) {
					var params = [];
					for (var i = 0; i < argmts.length; ++i)
						params.push(Helper.stringify(argmts[i]));
					this.compiled += this.options.ident + "." + name + "(" + params.join(", ") + ");\n\n";
				}
				var result = args.callback.apply(args.context || this, arguments);
				callback.call(this, ns, result);
			}, this);
		};
		
		if (options.lazy)
			ns.namespace.lazy(ns.path, execute, this);
		else
			execute.apply(this);

		return this;
	};
	
	return {
		
		getGlobal: Helper.method(Globals, Globals.getPath),
		setGlobal: Helper.method(Globals, Globals.setPath),
		
		options: {
			lazy: false,
			ident: "Scoped",
			compile: false			
		},
		
		compiled: "",
		
		nextScope: function () {
			if (!nextScope)
				nextScope = newScope(this, localNamespace, rootNamespace, globalNamespace);
			return nextScope;
		},
		
		subScope: function () {
			var sub = this.nextScope();
			childScopes.push(sub);
			nextScope = null;
			return sub;
		},
		
		binding: function (alias, namespaceLocator, options) {
			if (!bindings[alias] || !bindings[alias].readonly) {
				var ns;
				if (Helper.typeOf(namespaceLocator) != "string") {
					ns = {
						namespace: newNamespace({
							tree: true,
							root: namespaceLocator
						}),
						path: null	
					};
				} else
					ns = this.resolve(namespaceLocator);
				bindings[alias] = Helper.extend(options, ns);
			}
			return this;
		},
		
		resolve: function (namespaceLocator) {
			var parts = namespaceLocator.split(":");
			if (parts.length == 1) {
				return {
					namespace: privateNamespace,
					path: parts[0]
				};
			} else {
				var binding = bindings[parts[0]];
				if (!binding)
					throw ("The namespace '" + parts[0] + "' has not been defined (yet).");
				return {
					namespace: binding.namespace,
					path : binding.path && parts[1] ? binding.path + "." + parts[1] : (binding.path || parts[1])
				};
			}
		},
		
		define: function () {
			return custom.call(this, arguments, "define", function (ns, result) {
				ns.namespace.set(ns.path, result);
			});
		},
		
		extend: function () {
			return custom.call(this, arguments, "extend", function (ns, result) {
				ns.namespace.extend(ns.path, result);
			});
		},
		
		condition: function () {
			return custom.call(this, arguments, "condition", function (ns, result) {
				if (result)
					ns.namespace.set(ns.path, result);
			});
		},
		
		require: function () {
			var args = Helper.matchArgs(arguments, {
				dependencies: "array",
				hiddenDependencies: "array",
				callback: "function",
				context: "object"
			});
			args.callback = args.callback || function () {};
			var dependencies = args.dependencies || [];
			var allDependencies = dependencies.concat(args.hiddenDependencies || []);
			var count = allDependencies.length;
			var deps = [];
			var environment = {};
			if (count) {
				for (var i = 0; i < allDependencies.length; ++i) {
					var ns = this.resolve(allDependencies[i]);
					if (i < dependencies.length)
						deps.push(null);
					ns.namespace.obtain(ns.path, function (value) {
						if (this.i < deps.length)
							deps[this.i] = value;
						count--;
						if (count === 0) {
							deps.push(environment);
							args.callback.apply(args.context || this.ctx, deps);
						}
					}, {
						ctx: this,
						i: i
					});
				}
			} else {
				deps.push(environment);
				args.callback.apply(args.context || this, deps);
			}
			return this;
		},
		
		digest: function (namespaceLocator) {
			var ns = this.resolve(namespaceLocator);
			ns.namespace.digest(ns.path);
			return this;
		}		
		
	};
	
}
var globalNamespace = newNamespace({tree: true, global: true});
var rootNamespace = newNamespace({tree: true});
var rootScope = newScope(null, rootNamespace, rootNamespace, globalNamespace);

var Public = Helper.extend(rootScope, {
		
	guid: "4b6878ee-cb6a-46b3-94ac-27d91f58d666",
	version: '8.1426613087189',
		
	upgrade: Attach.upgrade,
	attach: Attach.attach,
	detach: Attach.detach,
	exports: Attach.exports
	
});

Public = Public.upgrade();
Public.exports();
	return Public;
}).call(this);
/*!
betajs-flash - v0.0.1 - 2015-03-24
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
		version: '5.1427217271706',
		__global: {}
	};
});

Scoped.define("module:FlashEmbedding", [ "base:Class", "jquery:", "base:Strings",
		"base:Functions", "base:Types", "base:Objs", "base:Ids", "base:Async", "module:__global",
		"module:FlashObjectWrapper", "module:FlashClassWrapper", "module:Helper" ], function(Class, $,
		Strings, Functions, Types, Objs, Ids, Async, moduleGlobal, FlashObjectWrapper, FlashClassWrapper, FlashHelper, scoped) {
	return Class.extend({
		scoped : scoped
	}, function(inherited) {
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
				this.__ready_queue = [];
				this.__wrappers = {};
				this.__staticWrappers = {};
				moduleGlobal[this.cid()] = this.__callbacks;
				flashOptions = Objs.extend({
					FlashVars: {}
				}, flashOptions);
				flashOptions.FlashVars.ready = this.__namespace + ".ready";
				$(container).html(FlashHelper.embedTemplate(flashOptions));
				this.__embedding = $(container).find("embed").get(0);
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
				return this.flashCreateCallbackObject.apply(this, arguments);
			},
			
			flashCreateCallbackObject : function() {
				return this.invoke("create_callback_object", arguments);
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

			flashAddEventListener : function() {
				return this.invoke("add_event_listener", arguments);
			},

			flashMain : function() {
				return this.invokeCached("main");
			},
			
			__ready: function () {
				if (!this.__is_ready) {
					this.__is_ready = true;
					Async.eventually(function () {
						Objs.iter(this.__ready_queue, function (entry) {
							entry.callback.call(entry.context || this);
						}, this);
					}, this);
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
	});
});
Scoped.define("module:Helper", ["base:Time", "base:Objs", "base:Types", "base:Net.Uri"], function (Time, Objs, Types, Uri) {
	return {
		
		options: {
			flashFile: "betajs-flash.swf"
		},
		
		embedTemplate: function (options) {
			options = Objs.extend(Objs.clone(this.options, 1), options);
			var params = [];
			params.push({
				"objectKey": "classid",
				"value": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
			});
			params.push({
				"objectKey": "codebase",
				"value": "http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"
			});
			params.push({
				"embedKey": "align",
				"value": "middle"
			});
			params.push({
				"embedKey": "play",
				"value": "true"
			});
			params.push({
				"embedKey": "loop",
				"value": "false"
			});
			params.push({
				"embedKey": "type",
				"value": "application/x-shockwave-flash"
			});
			params.push({
				"embedKey": "pluginspage",
				"value": "http://www.adobe.com/go/getflashplayer"
			});
			params.push({
				"objectParam": "quality",
				"embedKey": "quality",
				"value": "high"
			});
			params.push({
				"objectParam": "allowScriptAccess",
				"embedKey": "allowScriptAccess",
				"value": "always"
			});
			params.push({
				"objectParam": "wmode",
				"embedKey": "wmode",
				"value": "opaque"
			});
			params.push({
				"objectParam": "movie",
				"embedKey": "src",
				"value": options.flashFile + (options.forceReload ? "?" + Time.now() : "") 
			});
			if (options.width) {
				params.push({
					"objectKey": "width",
					"embedKey": "width",
					"value": options.width
				});
			}
			if (options.height) {
				params.push({
					"objectKey": "height",
					"embedKey": "height",
					"value": options.height
				});
			}
			if (options.bgcolor) {
				params.push({
					"objectParam": "bgcolor",
					"embedKey": "bgcolor",
					"value": options.bgcolor
				});
			}
			if (options.FlashVars) {
				params.push({
					"objectParam": "FlashVars",
					"embedKey": "FlashVars",
					"value": Types.is_object(options.FlashVars) ? Uri.encodeUriParams(options.FlashVars) : options.FlashVars
				});
			}
			var objectKeys = [];
			var objectParams = [];
			var embedKeys = [];
			Objs.iter(params, function (param) {
				if (param.objectKey)
					objectKeys.push(param.objectKey + '="' + param.value + '"');
				if (param.embedKey)
					embedKeys.push(param.embedKey + '="' + param.value + '"');
				if (param.objectParam)
					objectParams.push('<param name="' + param.objectParam + '" value="' + param.value + '" />');
			}, this);
			return "<object " + objectKeys.join(" ") + ">" + objectParams.join(" ") + "<embed " + embedKeys.join(" ") + "></embed></object>";
		}		
	};
});

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
					Objs.iter(embedding.__registry.get(objectType).methods, function (method) {
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
			},
			
			set: function (key, value) {
				return this.__embedding.flashSet.call(this.__embedding, this.__ident, key, value);
			},

			get: function (key) {
				return this.__embedding.flashGet.call(this.__embedding, this.__ident, key);
			}

		};
	});
});


Scoped.define("module:FlashClassWrapper", [ "base:Class", "base:Objs", "base:Functions"  ], function(Class, Objs, Functions, scoped) {
	return Class.extend({
		scoped : scoped
	}, function(inherited) {
		return {

			constructor : function(embedding, classType) {
				inherited.constructor.call(this);
				this.__embedding = embedding;
				this.__type = classType;
				if (embedding.__registry) {
					Objs.iter(embedding.__registry.get(classType).statics, function (method) {
						this[method] = function () {
							var args = Functions.getArguments(arguments);
							args.unshift(method);
							args.unshift(this.__type);
							return this.__embedding.flashStaticCall.apply(this.__embedding, args);
						};
						this[method + "Void"] = function () {
							var args = Functions.getArguments(arguments);
							args.unshift(method);
							args.unshift(this.__type);
							return this.__embedding.flashStaticCallVoid.apply(this.__embedding, args);
						};
					}, this);
				}
			},
			
			set: function (key, value) {
				return this.__embedding.flashSetStatic.call(this.__embedding, this.__type, key, value);
			},

			get: function (key) {
				return this.__embedding.flashGetStatic.call(this.__embedding, this.__type, key);
			}

		};
	});
});
}).call(Scoped);