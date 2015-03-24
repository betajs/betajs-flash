package 
{
    import flash.display.*;
	import flash.external.*;
    import flash.utils.*;
    import flash.system.*;
    import flash.desktop.*;
    import flash.events.*;
    import flash.net.*;
	
    public class Main extends Sprite {
    
    	private var instanceToString: Dictionary = new Dictionary(false);
    	private var stringToInstance: Dictionary = new Dictionary(false);
    	
    	private var instanceId: int = 0;
    	
    	private var flashVars: Object = null;
    	
    	private function jsonEncode(object: Object): Object {
			var encoded: Object = new Object();
			for (var key: * in object)
				encoded[key] = object[key];
			return encoded;
    	}
    	
    	private function newInstanceString(typeName: String): String {
		    var chars: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   		    var result: String = "";
		    for (var i: int = 0; i < 8; i++)
		    	result += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
		    instanceId++;
		    return "__FLASHOBJ__" + typeName + "__" + result + "__" + instanceId;
		}
		
		private function serializeError(error: Error): String {
			return "__FLASHERR__" + error.toString();
		}

        public function Main() {
        	ExternalInterface.addCallback("create", create);
        	ExternalInterface.addCallback("destroy", destroy);
        	ExternalInterface.addCallback("call", call);
        	ExternalInterface.addCallback("call_void", call_void);
        	ExternalInterface.addCallback("get", get);
        	ExternalInterface.addCallback("set", set);
        	ExternalInterface.addCallback("static_call", static_call);
        	ExternalInterface.addCallback("static_call_void", static_call_void);
        	ExternalInterface.addCallback("get_static", get_static);
        	ExternalInterface.addCallback("set_static", set_static);
        	ExternalInterface.addCallback("add_event_listener", add_event_listener);
        	ExternalInterface.addCallback("create_callback_object", create_callback_object);        	
        	ExternalInterface.addCallback("main", main);
        	flashVars = LoaderInfo(root.loaderInfo).parameters;
        	if (flashVars.hasOwnProperty("ready")) {
	        	setTimeout(function ():void {
	        		ExternalInterface.call(flashVars.ready);
	        	}, 0);        	
        	}
        }
        
        public function serialize(value: *): * {
        	if (getQualifiedClassName(value) == "Array") {
        		var result: Array = new Array();
        		for (var i: int = 0; i < value.length; ++i)
        			result.push(serialize(value[i]));
        		return result;
        	} else if (typeof(value) == "object") {
        		if (!instanceToString.hasOwnProperty(value)) {
        			var cls: String = value == this ? flash.utils.getQualifiedSuperclassName(value) : flash.utils.getQualifiedClassName(value)
        			var instanceString: String = newInstanceString(cls);
        			instanceToString[value] = instanceString;
        			stringToInstance[instanceString] = value;
        			return instanceString;
        		}
        		return instanceToString[value]; 
        	}
        	return value;
        }
        
        public function unserialize(value: *): * {
        	if (getQualifiedClassName(value) == "Array") {
        		var result: Array = new Array();
        		for (var i: int = 0; i < value.length; ++i)
        			result.push(unserialize(value[i]));
        		return result;
        	} else if (typeof(value) == "string") {
        		if (stringToInstance.hasOwnProperty(value))
        			return stringToInstance[value];
        	}
        	return value;
        }
        
        public function main(): String {
        	try {
        		return serialize(this);
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }

        public function create(className: String, ... args: *): String {
        	try {
	        	var myClass: Class = getDefinitionByName(className) as Class;
				var myInstance: *;
				if (args.length == 0)
					 myInstance = new myClass();
				else if (args.length == 1)
					myInstance = new myClass(unserialize(args[0]));
				else if (args.length == 2)
					myInstance = new myClass(unserialize(args[0]), unserialize(args[1]));
	        	return serialize(myInstance);
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }
        
        public function destroy(objectName: String): String {
        	try {
	        	var instance: * = stringToInstance[objectName];
	        	delete stringToInstance[objectName];
	        	delete instanceToString[instance];
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }

        public function call(objectName: String, methodName: String, ... args: *): * {
        	try {
	        	var instance: * = unserialize(objectName);
	        	return serialize(instance[methodName].apply(instance, unserialize(args)));
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        }
        
        public function call_void(objectName: String, methodName: String, ... args: *): String {
        	try {
	        	var instance: * = unserialize(objectName);
	        	instance[methodName].apply(instance, unserialize(args));
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }

        public function static_call(className: String, methodName: String, ... args: *): * {
           	try {
	        	var myClass: Class = getDefinitionByName(className) as Class;
	        	return serialize(myClass[methodName].apply(myClass, unserialize(args)));
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        }

        public function static_call_void(className: String, methodName: String, ... args: *): String {
        	try {
	        	var myClass: Class = getDefinitionByName(className) as Class;
	        	myClass[methodName].apply(myClass, unserialize(args));
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }

        public function get(objectName: String, attrName: String): * {
        	try {
	        	var instance: * = unserialize(objectName);
	        	return serialize(instance[attrName]);
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        }
        
        public function set(objectName: String, attrName: String, attrValue: *): String {
        	try {
	        	var instance: * = unserialize(objectName);
	        	instance[attrName] = unserialize(attrValue);
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }
 
        public function get_static(className: String, attrName: String): * {
        	try {
	        	var myClass: Class = getDefinitionByName(className) as Class;
	        	return serialize(myClass[attrName]);
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        }
        
        public function set_static(className: String, attrName: String, attrValue: *): String {
        	try {
	        	var myClass: Class = getDefinitionByName(className) as Class;
	        	myClass[attrName] = unserialize(attrValue);
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }
        
        public function create_callback_object(method: String, callback: String): String {
			try {
				var object: Object = new Object();
				object[method] = function (argument: Object): void {
					ExternalInterface.call(callback, jsonEncode(argument));
				};
				var result: * = serialize(object);;
				return result;
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }
        
        public function add_event_listener(objectName: String, type: String, callback: String): String {
        	try {
	        	unserialize(objectName).addEventListener(type, function(event: Event): void {
		        	var eventSerialized: String = serialize(event);
		        	ExternalInterface.call(callback, eventSerialized);
		        	destroy(eventSerialized);
				});
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }

    }
    
}
