/*!
betajs-flash - v0.0.16 - 2016-09-27
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/
/** @flow **//*!
betajs-scoped - v0.0.10 - 2016-04-07
Copyright (c) Oliver Friedmann
Apache-2.0 Software License.
*/
var Scoped = (function () {
var Globals = {

	get : function(key/* : string */) {
		if (typeof window !== "undefined")
			return window[key];
		if (typeof global !== "undefined")
			return global[key];
		return null;
	},

	set : function(key/* : string */, value) {
		if (typeof window !== "undefined")
			window[key] = value;
		if (typeof global !== "undefined")
			global[key] = value;
		return value;
	},
	
	setPath: function (path/* : string */, value) {
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
	
	getPath: function (path/* : string */) {
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
/*::
declare module Helper {
	declare function extend<A, B>(a: A, b: B): A & B;
}
*/

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
	__revert: null,
	
	upgrade: function (namespace/* : ?string */) {
		var current = Globals.get(namespace || Attach.__namespace);
		if (current && Helper.typeOf(current) == "object" && current.guid == this.guid && Helper.typeOf(current.version) == "string") {
			var my_version = this.version.split(".");
			var current_version = current.version.split(".");
			var newer = false;
			for (var i = 0; i < Math.min(my_version.length, current_version.length); ++i) {
				newer = parseInt(my_version[i], 10) > parseInt(current_version[i], 10);
				if (my_version[i] != current_version[i]) 
					break;
			}
			return newer ? this.attach(namespace) : current;				
		} else
			return this.attach(namespace);		
	},

	attach : function(namespace/* : ?string */) {
		if (namespace)
			Attach.__namespace = namespace;
		var current = Globals.get(Attach.__namespace);
		if (current == this)
			return this;
		Attach.__revert = current;
		if (current) {
			try {
				var exported = current.__exportScoped();
				this.__exportBackup = this.__exportScoped();
				this.__importScoped(exported);
			} catch (e) {
				// We cannot upgrade the old version.
			}
		}
		Globals.set(Attach.__namespace, this);
		return this;
	},
	
	detach: function (forceDetach/* : ?boolean */) {
		if (forceDetach)
			Globals.set(Attach.__namespace, null);
		if (typeof Attach.__revert != "undefined")
			Globals.set(Attach.__namespace, Attach.__revert);
		delete Attach.__revert;
		if (Attach.__exportBackup)
			this.__importScoped(Attach.__exportBackup);
		return this;
	},
	
	exports: function (mod, object, forceExport) {
		mod = mod || (typeof module != "undefined" ? module : null);
		if (typeof mod == "object" && mod && "exports" in mod && (forceExport || mod.exports == this || !mod.exports || Helper.isEmpty(mod.exports)))
			mod.exports = object || this;
		return this;
	}	

};

function newNamespace (opts/* : {tree ?: boolean, global ?: boolean, root ?: Object} */) {

	var options/* : {
		tree: boolean,
	    global: boolean,
	    root: Object
	} */ = {
		tree: typeof opts.tree === "boolean" ? opts.tree : false,
		global: typeof opts.global === "boolean" ? opts.global : false,
		root: typeof opts.root === "object" ? opts.root : {}
	};

	/*::
	type Node = {
		route: ?string,
		parent: ?Node,
		children: any,
		watchers: any,
		data: any,
		ready: boolean,
		lazy: any
	};
	*/

	function initNode(options)/* : Node */ {
		return {
			route: typeof options.route === "string" ? options.route : null,
			parent: typeof options.parent === "object" ? options.parent : null,
			ready: typeof options.ready === "boolean" ? options.ready : false,
			children: {},
			watchers: [],
			data: {},
			lazy: []
		};
	}
	
	var nsRoot = initNode({ready: true});
	
	if (options.tree) {
		if (options.global) {
			try {
				if (window)
					nsRoot.data = window;
			} catch (e) { }
			try {
				if (global)
					nsRoot.data = global;
			} catch (e) { }
		} else
			nsRoot.data = options.root;
	}
	
	function nodeDigest(node/* : Node */) {
		if (node.ready)
			return;
		if (node.parent && !node.parent.ready) {
			nodeDigest(node.parent);
			return;
		}
		if (node.route && node.parent && (node.route in node.parent.data)) {
			node.data = node.parent.data[node.route];
			node.ready = true;
			for (var i = 0; i < node.watchers.length; ++i)
				node.watchers[i].callback.call(node.watchers[i].context || this, node.data);
			node.watchers = [];
			for (var key in node.children)
				nodeDigest(node.children[key]);
		}
	}
	
	function nodeEnforce(node/* : Node */) {
		if (node.ready)
			return;
		if (node.parent && !node.parent.ready)
			nodeEnforce(node.parent);
		node.ready = true;
		if (node.parent) {
			if (options.tree && typeof node.parent.data == "object")
				node.parent.data[node.route] = node.data;
		}
		for (var i = 0; i < node.watchers.length; ++i)
			node.watchers[i].callback.call(node.watchers[i].context || this, node.data);
		node.watchers = [];
	}
	
	function nodeSetData(node/* : Node */, value) {
		if (typeof value == "object" && node.ready) {
			for (var key in value)
				node.data[key] = value[key];
		} else
			node.data = value;
		if (typeof value == "object") {
			for (var ckey in value) {
				if (node.children[ckey])
					node.children[ckey].data = value[ckey];
			}
		}
		nodeEnforce(node);
		for (var k in node.children)
			nodeDigest(node.children[k]);
	}
	
	function nodeClearData(node/* : Node */) {
		if (node.ready && node.data) {
			for (var key in node.data)
				delete node.data[key];
		}
	}
	
	function nodeNavigate(path/* : ?String */) {
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
	
	function nodeAddWatcher(node/* : Node */, callback, context) {
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
	
	function nodeUnresolvedWatchers(node/* : Node */, base, result) {
		node = node || nsRoot;
		result = result || [];
		if (!node.ready)
			result.push(base);
		for (var k in node.children) {
			var c = node.children[k];
			var r = (base ? base + "." : "") + c.route;
			result = nodeUnresolvedWatchers(c, r, result);
		}
		return result;
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
		
		get: function (path) {
			var node = nodeNavigate(path);
			return node.ready ? node.data : null;
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
		},
		
		unresolvedWatchers: function (path) {
			return nodeUnresolvedWatchers(nodeNavigate(path), path);
		},
		
		__export: function () {
			return {
				options: options,
				nsRoot: nsRoot
			};
		},
		
		__import: function (data) {
			options = data.options;
			nsRoot = data.nsRoot;
		}
		
	};
	
}
function newScope (parent, parentNS, rootNS, globalNS) {
	
	var self = this;
	var nextScope = null;
	var childScopes = [];
	var parentNamespace = parentNS;
	var rootNamespace = rootNS;
	var globalNamespace = globalNS;
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
				if (this.options.dependencies) {
					this.dependencies[ns.path] = this.dependencies[ns.path] || {};
					if (args.dependencies) {
						args.dependencies.forEach(function (dep) {
							this.dependencies[ns.path][this.resolve(dep).path] = true;
						}, this);
					}
					if (args.hiddenDependencies) {
						args.hiddenDependencies.forEach(function (dep) {
							this.dependencies[ns.path][this.resolve(dep).path] = true;
						}, this);
					}
				}
				var result = this.options.compile ? {} : args.callback.apply(args.context || this, arguments);
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
			compile: false,
			dependencies: false
		},
		
		compiled: "",
		
		dependencies: {},
		
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
				if (ns.namespace.get(ns.path))
					throw ("Scoped namespace " + ns.path + " has already been defined. Use extend to extend an existing namespace instead");
				ns.namespace.set(ns.path, result);
			});
		},
		
		assume: function () {
			var args = Helper.matchArgs(arguments, {
				assumption: true,
				dependencies: "array",
				callback: true,
				context: "object",
				error: "string"
			});
			var dependencies = args.dependencies || [];
			dependencies.unshift(args.assumption);
			this.require(dependencies, function (assumptionValue) {
				if (!args.callback.apply(args.context || this, arguments))
					throw ("Scoped Assumption '" + args.assumption + "' failed, value is " + assumptionValue + (args.error ? ", but assuming " + args.error : "")); 
			});
		},
		
		assumeVersion: function () {
			var args = Helper.matchArgs(arguments, {
				assumption: true,
				dependencies: "array",
				callback: true,
				context: "object",
				error: "string"
			});
			var dependencies = args.dependencies || [];
			dependencies.unshift(args.assumption);
			this.require(dependencies, function () {
				var argv = arguments;
				var assumptionValue = argv[0];
				argv[0] = assumptionValue.split(".");
				for (var i = 0; i < argv[0].length; ++i)
					argv[0][i] = parseInt(argv[0][i], 10);
				if (Helper.typeOf(args.callback) === "function") {
					if (!args.callback.apply(args.context || this, args))
						throw ("Scoped Assumption '" + args.assumption + "' failed, value is " + assumptionValue + (args.error ? ", but assuming " + args.error : ""));
				} else {
					var version = (args.callback + "").split(".");
					for (var j = 0; j < Math.min(argv[0].length, version.length); ++j)
						if (parseInt(version[j], 10) > argv[0][j])
							throw ("Scoped Version Assumption '" + args.assumption + "' failed, value is " + assumptionValue + ", but assuming at least " + args.callback);
				}
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
				var f = function (value) {
					if (this.i < deps.length)
						deps[this.i] = value;
					count--;
					if (count === 0) {
						deps.push(environment);
						args.callback.apply(args.context || this.ctx, deps);
					}
				};
				for (var i = 0; i < allDependencies.length; ++i) {
					var ns = this.resolve(allDependencies[i]);
					if (i < dependencies.length)
						deps.push(null);
					ns.namespace.obtain(ns.path, f, {
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
		},
		
		unresolved: function (namespaceLocator) {
			var ns = this.resolve(namespaceLocator);
			return ns.namespace.unresolvedWatchers(ns.path);
		},
		
		__export: function () {
			return {
				parentNamespace: parentNamespace.__export(),
				rootNamespace: rootNamespace.__export(),
				globalNamespace: globalNamespace.__export(),
				localNamespace: localNamespace.__export(),
				privateNamespace: privateNamespace.__export()
			};
		},
		
		__import: function (data) {
			parentNamespace.__import(data.parentNamespace);
			rootNamespace.__import(data.rootNamespace);
			globalNamespace.__import(data.globalNamespace);
			localNamespace.__import(data.localNamespace);
			privateNamespace.__import(data.privateNamespace);
		}
		
	};
	
}
var globalNamespace = newNamespace({tree: true, global: true});
var rootNamespace = newNamespace({tree: true});
var rootScope = newScope(null, rootNamespace, rootNamespace, globalNamespace);

var Public = Helper.extend(rootScope, {
		
	guid: "4b6878ee-cb6a-46b3-94ac-27d91f58d666",
	version: '43.1460041676769',
		
	upgrade: Attach.upgrade,
	attach: Attach.attach,
	detach: Attach.detach,
	exports: Attach.exports,
	
	__exportScoped: function () {
		return {
			globalNamespace: globalNamespace.__export(),
			rootNamespace: rootNamespace.__export(),
			rootScope: rootScope.__export()
		};
	},
	
	__importScoped: function (data) {
		globalNamespace.__import(data.globalNamespace);
		rootNamespace.__import(data.rootNamespace);
		rootScope.__import(data.rootScope);
	}
	
});

Public = Public.upgrade();
Public.exports();
	return Public;
}).call(this);
/*!
betajs-flash - v0.0.16 - 2016-09-27
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/

(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.Flash');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('browser', 'global:BetaJS.Browser');
Scoped.binding('jquery', 'global:jQuery');
Scoped.define("module:", function () {
	return {
    "guid": "3adc016a-e639-4d1a-b4cb-e90cab02bc4f",
    "version": "34.1475008142785"
};
});
Scoped.assumeVersion('base:version', 444);
Scoped.assumeVersion('browser:version', 58);
Scoped.extend("module:", ["module:"], function () {
	return {
		options: {
			flashFile: "betajs-flash.swf"			
		}
	};
});

Scoped.define("module:FlashEmbedding", [ "base:Class", "base:Events.EventsMixin", "jquery:", "base:Strings",
		"base:Functions", "base:Types", "base:Objs", "base:Ids", "base:Time", "base:Timers.Timer", "base:Async", "base:Tokens",
		"module:FlashObjectWrapper", "module:FlashClassWrapper", "browser:FlashHelper", "module:" ], function(Class, EventsMixin, $,
		Strings, Functions, Types, Objs, Ids, Time, Timer, Async, Tokens, FlashObjectWrapper, FlashClassWrapper, FlashHelper, mod, scoped) {
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
				this.__namespace = "flash_" + Tokens.generate_token();
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
					container = $("<div></div>").appendTo("body");
					container.css("width", "1px");
					container.css("height", "1px");
					container.css("visibility", "hidden");
					container.css("position", "absolute");
					container.css("z-index", "-1");
					container = container.get(0);
				}
				this.__container = $(container);
				this.__embedding = FlashHelper.embedFlashObject(container, flashOptions);
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
				this.__container.html("");
				if (this.__helper_container)
					$(this.__container).remove();
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
					var lookup = embedding.__registry.get(objectType);
					if (lookup) {
						Objs.iter(lookup.methods, function (method) {
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
				}
			},
			
			destroy: function () {
				this.__embedding.flashDestroy(this.__ident);
				inherited.destroy.call(this);
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
					var lookup = embedding.__registry.get(classType);
					if (lookup) {
						Objs.iter(lookup.statics, function (method) {
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