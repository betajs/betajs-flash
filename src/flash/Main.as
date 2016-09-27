package 
{
    import flash.display.*;
	import flash.external.*;
    import flash.utils.*;
    import flash.system.*;
    import flash.desktop.*;
    import flash.events.*;
    import flash.net.*;
	import com.adobe.images.*;	
    
    public class Main extends Sprite {
    	
    	private static var errors: * = {"1000":"The system is out of memory.","1001":"The method %m is not implemented.","1002":"The precision argument must be between 0 and 20; got %d","1003":"The radix argument must be between 2 and 36; got %d","1004":"A method of '%t' was invoked on an incompatible object.","1005":"Array index is not an integer (%f)","1006":"Call attempted on an object that is not a function.","1007":"Instantiation attempted on a non-constructor.","1008":"%n is ambiguous; more than one binding matches.","1009":"null has no properties.","1010":"undefined has no properties.","1011":"Method %m contained illegal opcode %d at offset %d.","1012":"The last instruction exceeded code size.","1013":"Cannot call OP_findproperty when scopeDepth is 0.","1014":"Class %n could not be found.","1015":"Method %m cannot set default xml namespace","1017":"Scope stack overflow.","1018":"Scope stack underflow.","1019":"Getscopeobject %d is out of bounds.","1020":"Code cannot fall off the end of a method.","1021":"At least one branch target was not on a valid instruction in the method","1023":"Stack overflow.","1024":"Stack underflow.","1025":"An invalid register %d was accessed.","1026":"Slot %d exceeds slotCount=%d of %t.","1027":"Method_info %d exceeds method_count=%d.","1028":"Disp_id %d exceeds max_disp_id=%d of %t.","1029":"Disp_id %d is undefined on %t.","1030":"Stack depth unbalanced. %d != %d.","1031":"Scope depth unbalanced. %d != %d.","1032":"Cpool index %d out of range %d.","1033":"Cpool entry %d wrong type.","1034":"Type Coercion failed: cannot convert %a to %t","1035":"Illegal super expression in method %m","1037":"Cannot assign to a method %n on %t","1038":"%n is already defined","1039":"Cannot verify method until it is referenced","1040":"RHS of instanceof must be a Class or Function","1041":"RHS of operator must be a Class","1042":"Not an ABC file. major_version=%d minor_version=%d","1043":"Invalid code_length=%d","1044":"MethodInfo-%d unsupported flags=%d","1045":"Unsupported traits kind=%d","1046":"MethodInfo-%d referenced before definition","1047":"No Entry Point Found","1049":"Prototype objects must be vanilla Objects","1050":"Cannot convert %o to primitive.","1051":"Illegal early binding access to %t","1052":"Invalid URI passed to %s function.","1053":"Illegal override of %n in %t","1054":"Illegal range or target offsets in exception handler","1055":"%S has no properties","1056":"Cannot create property %n on %t","1057":"%t may only contain methods","1058":"Illegal operand type: %t must be %t","1059":"ClassInfo-%d referenced before definition","1060":"ClassInfo %d exceeds class_count=%d.","1061":"The value %1 cannot be converted to %2 without losing precision.","1063":"Argument count mismatch on %m. Expected %d, got %d","1064":"Cannot call method %m as constructor","1065":"Variable %n is not defined","1066":"Function('function body') is not supported","1067":"Native method %m has illegal method body","1068":"%t and %t cannot be reconciled","1069":"Property %n not found on %t and there is no default value","1070":"Method %n not found on %t","1071":"Function %m has already been bound to %t","1072":"Disp_id 0 is illegal.","1073":"Non-override method %m replaced because of duplicate disp_id %d","1075":"Math is not a function","1076":"Math is not a constructor","1077":"Illegal read of write-only property %n on %t","1078":"Illegal opcode/multiname combination: %d <%n>","1079":"Native methods not allowed in loaded code","1080":"Illegal value for namespace","1082":"No default namespace has been set","1083":"The prefix \"%S\" for element \"%w\" is not bound.","1084":"Element or attribute (\"%w\") do not match QName production: QName::=(NCName':')?NCName","1085":"The element type \"%S\" must be terminated by the matching end-tag \"\".","1086":"The %s method works only on lists containing one item.","1087":"Assignment to indexed XML is not allowed.","1088":"The markup in the document following the root element must be well-formed.","1089":"Assignment to lists with more than one item is not supported","1090":"XML parser failure: element is malformed","1091":"XML parser failure: Unterminated CDATA section","1092":"XML parser failure: Unterminated XML declaration","1093":"XML parser failure: Unterminated DOCTYPE declaration","1094":"XML parser failure: Unterminated comment","1095":"XML parser failure: Unterminated attribute","1096":"XML parser failure: Unterminated element","1097":"XML parser failure: Unterminated processing instruction","1098":"Illegal prefix '%S' for 'no namespace'.","1100":"Cannot supply flags when constructing one RegExp from another.","1101":"Cannot verify method %m with unknown scope","1102":"Illegal default value for type %n","1103":"Class %n cannot extend final base class","1104":"Attribute \"%S\" was already specified for element \"%S\".","1107":"The ABC data is corrupt, attempt to read out of bounds","1108":"The OP_newclass opcode was used with the incorrect base class","1109":"Attempt to directly call unbound function %m from method %m","1110":"%n cannot extend %t","1111":"%n cannot implement %t","1112":"Argument count mismatch on class coercion. Expected 1, got %d","1113":"OP_newactivation used in method without NEED_ACTIVATION flag","1114":"OP_getglobalslot or OP_setglobalslot used with no global scope","1115":"%n is not a constructor","1116":"second argument to Function.prototype.apply must be an array","1500":"Error opening file '%S'.","1501":"Error writing to file '%S'.","1502":"A script has executed for longer than 15 seconds.","1503":"A script did not exit in a timely fashion and was terminated.","1504":"End of file","1505":"The string index %d is out of bounds; must be in range %d to %d.","1506":"The range specified is invalid.","1507":"Argument '%s' may not be null.","1508":"The value specified for argument '%s' is invalid.","1509":"There was an error decompressing the data.","1510":"When the callback argument is a method of a class, the optional argument must be null.","2000":"No active security context.","2001":"Too few arguments were specified; got %1, %2 expected.","2002":"Operation attempted on invalid socket.","2003":"Invalid socket port number specified.","2005":"Parameter %1 is of the incorrect type. Should be type %2.","2007":"Parameter %1 must be non-null.","2009":"This method cannot be used on a text field with a style sheet.","2010":"Local-with-filesystem SWF files are not permitted to use sockets.","2011":"Socket connection failed to %1:%2.","2013":"Feature can only be used in Flash Authoring.","2014":"Feature is not available at this time.","2015":"Invalid BitmapData.","2017":"Only trusted local files may cause the Flash Player to exit.","2018":"System.exit is only available in the standalone Flash Player.","2019":"Depth specified is invalid.","2020":"MovieClips objects with different parents cannot be swapped.","2021":"Object creation failed.","2022":"Class %1 must inherit from DisplayObject to link to a symbol.","2023":"Class %1 must inherit from Sprite to link to the root.","2024":"An object cannot be added as a child of itself.","2025":"The supplied DisplayObject must be a child of the caller.","2026":"An error occurred navigating to the URL %1.","2027":"Parameter %1 must be a non-negative number; got %2.","2028":"Local-with-filesystem SWF file %1 cannot access Internet URL %2.","2029":"This URLStream object does not have a stream opened.","2031":"Socket Error.","2032":"Stream Error.","2033":"Key Generation Failed.","2034":"An invalid digest was supplied.","2035":"URL Not Found.","2036":"Load Never Completed.","2037":"Functions called in incorrect sequence, or earlier call was unsuccessful.","2038":"File I/O Error.","2039":"Invalid remote URL protocol. The remote URL protocol must be HTTP or HTTPS.","2041":"Only one file browsing session may be performed at a time.","2042":"The digest property is not supported by this load operation.","2044":"Unhandled %1:.","2046":"The loaded file did not have a valid signature.","2047":"Security sandbox violation: %1: %2 cannot access %3.","2048":"Security sandbox violation: %1 cannot load data from %2.","2049":"Security sandbox violation: %1 cannot upload data to %2.","2051":"Security sandbox violation: %1 cannot evaluate scripting URLs within %2 (allowScriptAccess is %3). Attempted URL was %4.","2052":"Only String arguments are permitted for allowDomain and allowInsecureDomain.","2053":"Security sandbox violation: %1 cannot clear an interval timer set by %2.","2054":"The value of Security.exactSettings cannot be changed after it has been used.","2055":"The print job could not be started.","2056":"The print job could not be sent to the printer.","2057":"The page could not be added to the print job.","2059":"Security sandbox violation: %1 cannot overwrite an ExternalInterface callback added by %2.","2060":"Security sandbox violation: ExternalInterface caller %1 cannot access %2.","2061":"No ExternalInterface callback %1 registered.","2062":"Children of Event must override clone() {return new MyEventClass (...);}.","2063":"Error attempting to execute IME command.","2065":"The focus cannot be set for this target.","2066":"The Timer delay specified is out of range.","2067":"The ExternalInterface is not available in this container. ExternalInterface requires Internet Explorer ActiveX, Firefox, Mozilla 1.7.5 and greater, or other browsers that support NPRuntime.","2068":"Invalid sound.","2069":"The Loader class does not implement this method.","2070":"Security sandbox violation: caller %1 cannot access Stage owned by %2.","2071":"The Stage class does not implement this property or method.","2073":"There was a problem saving the application to disk.","2074":"The stage is too small to fit the download ui.","2075":"The downloaded file is invalid.","2077":"This filter operation cannot be performed with the specified input parameters.","2078":"The name property of a Timeline-placed object cannot be modified.","2079":"Classes derived from Bitmap can only be associated with defineBits characters (bitmaps).","2082":"Connect failed because the object is already connected.","2083":"Close failed because the object is not connected.","2084":"The AMF encoding of the arguments cannot exceed 40K.","2086":"A setting in the mms.cfg file prohibits this FileReference request.","2087":"The FileReference.download() file name contains prohibited characters.","2094":"Event dispatch recursion overflow.","2095":"%1 was unable to invoke callback %2.","2096":"The HTTP request header %1 cannot be set via ActionScript.","2097":"The FileFilter Array is not in the correct format.","2098":"The loading object is not a .swf file, you cannot request SWF properties from it.","2099":"The loading object is not sufficiently loaded to provide this information.","2100":"The ByteArray parameter in Loader.loadBytes() must have length greater than 0.","2101":"The String passed to URLVariables.decode() must be a URL-encoded query string containing name/value pairs.","2102":"The before XMLNode parameter must be a child of the caller.","2103":"XML recursion failure: new child would create infinite loop.","2108":"Scene %1 was not found.","2109":"Frame label %1 not found in scene %2.","2110":"The value of Security.disableAVM1Loading cannot be set unless the caller can access the stage and is in an ActionScript 3.0 SWF file.","2111":"Security.disableAVM1Loading is true so the current load of the ActionScript 1.0/2.0 SWF file has been blocked.","2112":"Provided parameter LoaderContext.ApplicationDomain is from a disallowed domain.","2113":"Provided parameter LoaderContext.SecurityDomain is from a disallowed domain.","2114":"Parameter %1 must be null.","2115":"Parameter %1 must be false.","2116":"Parameter %1 must be true.","2118":"The LoaderInfo class does not implement this method.","2119":"Security sandbox violation: caller %1 cannot access LoaderInfo.applicationDomain owned by %2.","2121":"Security sandbox violation: %1: %2 cannot access %3. This may be worked around by calling Security.allowDomain.","2122":"Security sandbox violation: %1: %2 cannot access %3. A policy file is required, but the checkPolicyFile flag was not set when this media was loaded.","2123":"Security sandbox violation: %1: %2 cannot access %3. No policy files granted access.","2124":"Loaded file is an unknown type.","2125":"Security sandbox violation: %1 cannot use Runtime Shared Library %2 because crossing the boundary between ActionScript 3.0 and ActionScript 1.0/2.0 objects is not allowed.","2126":"NetConnection object must be connected.","2127":"FileReference POST data cannot be type ByteArray.","2129":"Connection to %1 failed.","2130":"Unable to flush SharedObject.","2131":"Definition %1 cannot be found.","2132":"NetConnection.connect cannot be called from a netStatus event handler.","2133":"Callback %1 is not registered.","2134":"Cannot create SharedObject.","2136":"The SWF file %1 contains invalid data.","2137":"Security sandbox violation: %1 cannot navigate window %2 within %3 (allowScriptAccess is %4). Attempted URL was %5.","2138":"Rich text XML could not be parsed.","2139":"SharedObject could not connect.","2140":"Security sandbox violation: %1 cannot load %2. Local-with-filesystem and local-with-networking SWF files cannot load each other.","2141":"Only one PrintJob may be in use at a time.","2142":"Security sandbox violation: local SWF files cannot use the LoaderContext.securityDomain property. %1 was attempting to load %2.","2143":"AccessibilityImplementation.get_accRole() must be overridden from its default.","2144":"AccessibilityImplementation.get_accState() must be overridden from its default.","2145":"Cumulative length of requestHeaders must be less than 8192 characters.","2146":"Security sandbox violation: %1 cannot call %2 because the HTML/container parameter allowNetworking has the value %3.","2147":"Forbidden protocol in URL %1.","2148":"SWF file %1 cannot access local resource %2. Only local-with-filesystem and trusted local SWF files may access local resources.","2149":"Security sandbox violation: %1 cannot make fscommand calls to %2 (allowScriptAccess is %3).","2150":"An object cannot be added as a child to one of it's children (or children's children, etc.).","2151":"You cannot enter full screen mode when the settings dialog is visible.","2152":"Full screen mode is not allowed.","2153":"The URLRequest.requestHeaders array must contain only non-NULL URLRequestHeader objects.","2154":"The NetStream Object is invalid. This may be due to a failed NetConnection.","2155":"The ExternalInterface.call functionName parameter is invalid. Only alphanumeric characters are supported.","2156":"Port %1 may not be accessed using protocol %2. Calling SWF was %3.","2157":"Rejecting URL %1 because the 'asfunction:' protocol may only be used for link targets, not for networking APIs.","2158":"The NetConnection Object is invalid. This may be due to a dropped NetConnection.","2159":"The SharedObject Object is invalid.","2160":"The TextLine is INVALID and cannot be used to access the current state of the TextBlock.","2161":"An internal error occured while laying out the text.","2162":"The Shader output type is not compatible for this operation.","2163":"The Shader input type %1 is not compatible for this operation.","2164":"The Shader input %1 is missing or an unsupported type.","2165":"The Shader input %1 does not have enough data.","2166":"The Shader input %1 lacks valid dimensions.","2167":"The Shader does not have the required number of inputs for this operation.","2168":"Static text lines have no atoms and no reference to a text block.","2169":"The method %1 may not be used for browser scripting. The URL %2 requested by %3 is being ignored. If you intend to call browser script, use navigateToURL instead.","2170":"Security sandbox violation: %1 cannot send HTTP headers to %2.","2171":"The Shader object contains no byte code to execute.","2172":"The ShaderJob is already running or finished.","2174":"Only one download, upload, load or save operation can be active at a time on each FileReference.","2175":"One or more elements of the content of the TextBlock has a null ElementFormat.","2176":"Certain actions, such as those that display a pop-up window, may only be invoked upon user interaction, for example by a mouse click or button press.","2177":"The Shader input %1 is too large.","2178":"The Clipboard.generalClipboard object must be used instead of creating a new Clipboard.","2179":"The Clipboard.generalClipboard object may only be read while processing a flash.events.Event.PASTE event.","2180":"It is illegal to move AVM1 content (AS1 or AS2) to a different part of the displayList when it has been loaded into AVM2 (AS3) content.","2181":"The TextLine class does not implement this property or method.","2182":"Invalid fieldOfView value. The value must be greater than 0 and less than 180.","2183":"Scale values must not be zero.","2184":"The ElementFormat object is locked and cannot be modified.","2185":"The FontDescription object is locked and cannot be modified.","2186":"Invalid focalLength %1.","2187":"Invalid orientation style %1. Value must be one of 'Orientation3D.EULER_ANGLES', 'Orientation3D.AXIS_ANGLE', or 'Orientation3D.QUATERNION'.","2188":"Invalid raw matrix. Matrix must be invertible.","2189":"A Matrix3D can not be assigned to more than one DisplayObject.","2190":"The attempted load of %1 failed as it had a Content-Disposition of attachment set.","2191":"The Clipboard.generalClipboard object may only be written to as the result of user interaction, for example by a mouse click or button press.","2192":"An unpaired Unicode surrogate was encountered in the input.","2193":"Security sandbox violation: %1: %2 cannot access %3.","2194":"Parameter %1 cannot be a Loader.","2195":"Error thrown as Loader called %1.","2196":"Parameter %1 must be an Object with only String values.","2200":"The SystemUpdater class is not supported by this player.","2201":"The requested update type is not supported on this operating system.","2202":"Only one SystemUpdater action is allowed at a time.","2203":"The requested SystemUpdater action cannot be completed.","2204":"This operation cannot be canceled because it is waiting for user interaction.","2205":"Invalid update type %1.","2500":"An error occurred decrypting the signed swf file. The swf will not be loaded.","2501":"This property can only be accessed during screen sharing.","2502":"This property can only be accessed if sharing the entire screen.","3000":"Illegal path name.","3001":"File or directory access denied.","3002":"File or directory exists.","3003":"File or directory does not exist.","3004":"Insufficient file space.","3005":"Insufficient system resources.","3006":"Not a file.","3007":"Not a directory.","3008":"Read-only or write-protected media.","3009":"Cannot move file or directory to a different device.","3010":"Directory is not empty.","3011":"Move or copy destination already exists.","3012":"Cannot delete file or directory.","3013":"File or directory is in use.","3014":"Cannot copy or move a file or directory to overwrite a containing directory.","3015":"Loader.loadBytes() is not permitted to load content with executable code.","3016":"No application was found that can open this file.","3100":"A SQLConnection cannot be closed while statements are still executing.","3101":"Database connection is already open.","3102":"Name argument specified was invalid. It must not be null or empty.","3103":"Operation cannot be performed while there is an open transaction on this connection.","3104":"A SQLConnection must be open to perform this operation.","3105":"Operation is only allowed if a connection has an open transaction.","3106":"Property cannot be changed while SQLStatement.executing is true.","3107":"%1 may not be called unless SQLResult.complete is false.","3108":"Operation is not permitted when the SQLStatement.text property is not set.","3109":"Operation is not permitted when the SQLStatement.sqlConnection property is not set.","3110":"Operation cannot be performed while SQLStatement.executing is true.","3111":"An invalid schema type was specified.","3112":"An invalid transaction lock type was specified.","3113":"Reference specified is not of type File.","3114":"An invalid open mode was specified.","3115":"SQL Error.","3116":"An internal logic error occurred.","3117":"Access permission denied.","3118":"Operation aborted.","3119":"Database file is currently locked.","3120":"Table is locked.","3121":"Out of memory.","3122":"Attempt to write a readonly database.","3123":"Database disk image is malformed.","3124":"Insertion failed because database is full.","3125":"Unable to open the database file.","3126":"Database lock protocol error.","3127":"Database is empty.","3128":"Disk I/O error occurred.","3129":"The database schema changed.","3130":"Too much data for one row of a table.","3131":"Abort due to constraint violation.","3132":"Data type mismatch.","3133":"An internal error occurred.","3134":"Feature not supported on this operating system.","3135":"Authorization denied.","3136":"Auxiliary database format error.","3137":"An index specified for a parameter was out of range.","3138":"File opened is not a database file.","3139":"The page size specified was not valid for this operation.","3140":"The encryption key size specified was not valid for this operation. Keys must be exactly 16 bytes in length","3141":"The requested database configuration is not supported.","3143":"Unencrypted databases may not be reencrypted.","3200":"Cannot perform operation on closed window.","3201":"Adobe Reader cannot be found.","3202":"Adobe Reader 8.1 or later cannot be found.","3203":"Default Adobe Reader must be version 8.1 or later.","3204":"An error ocurred trying to load Adobe Reader.","3205":"Only application-sandbox content can access this feature.","3206":"Caller %1 cannot set LoaderInfo property %2.","3207":"Application-sandbox content cannot access this feature.","3208":"Attempt to access invalid clipboard.","3209":"Attempt to access dead clipboard.","3210":"The application attempted to reference a JavaScript object in a HTML page that is no longer loaded.","3211":"Drag and Drop File Promise error: %1","3212":"Cannot perform operation on a NativeProcess that is not running.","3213":"Cannot perform operation on a NativeProcess that is already running.","3214":"NativeProcessStartupInfo.executable does not specify a valid executable file.","3215":"NativeProcessStartupInfo.workingDirectory does not specify a valid directory.","3216":"Error while reading data from NativeProcess.standardOutput.","3217":"Error while reading data from NativeProcess.standardError.","3218":"Error while writing data to NativeProcess.standardInput.","3219":"The NativeProcess could not be started. '%1'","3220":"Action '%1' not allowed in current security context '%2'.","3221":"Adobe Flash Player cannot be found.","3222":"The installed version of Adobe Flash Player is too old.","3223":"DNS lookup error: platform error %1","3224":"Socket message too long","3225":"Cannot send data to a location when connected.","3226":"Cannot import a SWF file when LoaderContext.allowCodeImport is false.","3227":"Cannot launch another application from background.","3228":"StageWebView encountered an error during the load operation.","3229":"The protocol is not supported.:","3230":"The browse operation is unsupported.","3300":"Voucher is invalid.","3301":"User authentication failed.","3302":"Flash Access server does not support SSL.","3303":"Content expired.","3304":"User authorization failed (for example, the user has not purchased the content).","3305":"Can't connect to the server.","3306":"Client update required (Flash Access server requires new client).","3307":"Generic internal Flash Access failure.","3308":"Wrong voucher key.","3309":"Video content is corrupted.","3310":"The AIR application or Flash Player SWF does not match the one specified in the DRM policy.","3311":"The version of the application does not match the one specified in the DRM policy.","3312":"Verification of voucher failed.","3313":"Write to the file system failed.","3314":"Verification of FLV/F4V header file failed.","3315":"The current security context does not allow this operation.","3316":"The value of LocalConnection.isPerUser cannot be changed because it has already been locked by a call to LocalConnection.connect, .send, or .close.","3317":"Failed to load Flash Access module.","3318":"Incompatible version of Flash Access module found.","3319":"Missing Flash Access module API entry point.","3320":"Generic internal Flash Access failure.","3321":"Individualization failed.","3322":"Device binding failed.","3323":"The internal stores are corrupted.","3324":"Reset license files and the client will fetch a new machine token.","3325":"Internal stores are corrupt.","3326":"Call customer support.","3327":"Clock tampering detected.","3328":"Server error; retry the request.","3329":"Error in application-specific namespace.","3330":"Need to authenticate the user and reacquire the voucher.","3331":"Content is not yet valid.","3332":"Cached voucher has expired. Reacquire the voucher from the server.","3333":"The playback window for this policy has expired.","3334":"This platform is not allowed to play this content.","3335":"Invalid version of Flash Access module. Upgrade AIR or Flash Access module for the Flash Player.","3336":"This platform is not allowed to play this content.","3337":"Upgrade Flash Player or AIR and retry playback.","3338":"Unknown connection type.","3339":"Can't play back on analog device. Connect to a digital device.","3340":"Can't play back because connected analog device doesn't have the correct capabilities.","3341":"Can't play back on digital device.","3342":"The connected digital device doesn't have the correct capabilities.","3343":"Internal Error.","3344":"Missing Flash Access module.","3345":"This operation is not permitted with content protected using Flash Access.","3346":"Failed migrating local DRM data, all locally cached DRM vouchers are lost.","3347":"The device does not meet the Flash Access server's playback device constraints.","3348":"This protected content is expired.","3349":"The Flash Access server is running at a version that's higher than the max supported by this runtime.","3350":"The Flash Access server is running at a version that's lower than the min supported by this runtime.","3351":"Device Group registration token is corrupted, please refresh the token by registering again to the DRMDeviceGroup.","3352":"The server is using a newer version of the registration token for this Device Group. Please refresh the token by registering again to the DRMDeviceGroup.","3353":"the server is using an older version of the registration token for this Device Group.","3354":"Device Group registration is expired, please refresh the token by registering again to the DRMDeviceGroup.","3355":"The server denied this Device Group registration request.","3356":"The root voucher for this content's DRMVoucher was not found.","3357":"The DRMContentData provides no valid embedded voucher and no Flash Access server url to acquire the voucher from.","3358":"ACP protection is not available on the device but required to playback the content.","3359":"CGMSA protection is not available on the device but required to playback the content.","3360":"Device Group registration is required before doing this operation.","3361":"The device is not registered to this Device Group.","3362":"Asynchronous operation took longer than maxOperationTimeout.","3363":"The M3U8 playlist passed in had unsupported content.","3364":"The framework requested the device ID, but the returned value was empty.","3365":"This browser/platform combination does not allow DRM protected playback when in incognito mode.","3366":"The host runtime called the Access library with a bad parameter.","3367":"M3U8 manifest signing failed.","3368":"The user cancelled the operation, or has entered settings that disallow access to the system.","3400":"An error occured while executing JavaScript code.","3401":"Security sandbox violation: An object with this name has already been registered from another security domain.","3402":"Security sandbox violation: Bridge caller %1 cannot access %2.","3500":"The extension context does not have a method with the name %1.","3501":"The extension context has already been disposed.","3502":"The extension returned an invalid value.","3503":"The extension was left in an invalid state.","3600":"No valid program set.","3601":"No valid index buffer set.","3602":"Sanity check on parameters failed, %1 triangles and %2 index offset.","3603":"Not enough indices in this buffer. %1 triangles at offset %2, but there are only %3 indices in buffer.","3604":"Sampler %1 binds a texture that is also bound for render to texture.","3605":"Sampler %1 binds an invalid texture.","3606":"Sampler %1 format does not match texture format.","3607":"Stream %1 is set but not used by the current vertex program.","3608":"Stream %1 is invalid.","3609":"Stream %1 does not have enough vertices.","3610":"Stream %1 vertex offset is out of bounds","3611":"Stream %1 is read by the current vertex program but not set.","3612":"Programs must be in little endian format.","3613":"The native shader compilation failed.","3614":"The native shader compilation failed.\\nOpenGL specific: %1","3615":"AGAL validation failed: Program size below minimum length for %1 program.","3616":"AGAL validation failed: Not an AGAL program. Wrong magic byte for %1 program.","3617":"AGAL validation failed: Bad AGAL version for %1 program. Current version is %2.","3618":"AGAL validation failed: Bad AGAL program type identifier for %1 program.","3619":"AGAL validation failed: Shader type must be either fragment or vertex for %1 program.","3620":"AGAL validation failed: Invalid opcode, value out of range: %2 at token %3 of %1 program.","3621":"AGAL validation failed: Invalid opcode, %2 is not implemented in this version at token %3 of %1 program.","3622":"AGAL validation failed: Opcode %2 only allowed in fragment programs at token %3 of %1 program.","3623":"AGAL validation failed: Block nesting underflow - EIF without opening IF condition. At token %3 of %1 program.","3624":"AGAL validation failed: Block nesting overflow. Too many nested IF blocks. At token %3 of %1 program.","3625":"AGAL validation failed: Bad AGAL source operands. Both are constants (this must be precomputed) at token %2 of %1 program.","3626":"AGAL validation failed: Opcode %2, both operands are indirect reads at token %3 of %1 program.","3627":"AGAL validation failed: Opcode %2 destination operand must be all zero at token %3 of %1 program.","3628":"AGAL validation failed: The destination operand for the %2 instruction must mask w (use .xyz or less) at token %3 of %1 program.","3629":"AGAL validation failed: Too many tokens (%2) for %1 program.","3630":"Fragment shader type is not fragment.","3631":"Vertex shader type is not vertex.","3632":"AGAL linkage: Varying %1 is read in the fragment shader but not written to by the vertex shader.","3633":"AGAL linkage: Varying %1 is only partially written to. Must write all four components.","3634":"AGAL linkage: Fragment output needs to write to all components.","3635":"AGAL linkage: Vertex output needs to write to all components.","3636":"AGAL validation failed: Unused operand is not set to zero for %2 at token %3 of %1 program.","3637":"AGAL validation failed: Sampler registers only allowed in fragment programs for %2 at token %3 of %1 program.","3638":"AGAL validation failed: Sampler register only allowed as second operand in texture instructions for %2 at token %3 of %1 program.","3639":"AGAL validation failed: Indirect addressing only allowed in vertex programs for %2 at token %3 of %1 program.","3640":"AGAL validation failed: Indirect addressing only allowed into constant registers for %2 at token %3 of %1 program.","3641":"AGAL validation failed: Indirect addressing not allowed for this operand in this instruction for %2 at token %3 of %1 program.","3642":"AGAL validation failed: Indirect source type must be attribute, constant or temporary for %2 at token %3 of %1 program.","3643":"AGAL validation failed: Indirect addressing fields must be zero for direct addressing for %2 at token %3 of %1 program.","3644":"AGAL validation failed: Varying registers can only be read in fragment programs for %2 at token %3 of %1 program.","3645":"AGAL validation failed: Attribute registers can only be read in vertex programs for %2 at token %3 of %1 program.","3646":"AGAL validation failed: Can not read from output register for %2 at token %3 of %1 program.","3647":"AGAL validation failed: Temporary register read without being written to for %2 at token %3 of %1 program.","3648":"AGAL validation failed: Temporary register component read without being written to for %2 at token %3 of %1 program.","3649":"AGAL validation failed: Sampler registers can not be written to for %2 at token %3 of %1 program.","3650":"AGAL validation failed: Varying registers can only be written in vertex programs for %2 at token %3 of %1 program.","3651":"AGAL validation failed: Attribute registers can not be written to for %2 at token %3 of %1 program.","3652":"AGAL validation failed: Constant registers can not be written to for %2 at token %3 of %1 program.","3653":"AGAL validation failed: Destination writemask is zero for %2 at token %3 of %1 program.","3654":"AGAL validation failed: Reserve bits should be zero for %2 at token %3 of %1 program.","3655":"AGAL validation failed: Unknown register type for %2 at token %3 of %1 program.","3656":"AGAL validation failed: Sampler register index out of bounds for %2 at token %3 of %1 program.","3657":"AGAL validation failed: Varying register index out of bounds for %2 at token %3 of %1 program.","3658":"AGAL validation failed: Attribute register index out of bounds for %2 at token %3 of %1 program.","3659":"AGAL validation failed: Constant register index out of bounds for %2 at token %3 of %1 program.","3660":"AGAL validation failed: Output register index out of bounds for %2 at token %3 of %1 program.","3661":"AGAL validation failed: Temporary register index out of bounds for %2 at token %3 of %1 program.","3662":"AGAL validation failed: Cube map samplers must set wrapping to clamp mode for %2 at token %3 of %1 program.","3663":"Sampler %1 binds an undefined texture.","3664":"AGAL validation failed: Unknown sampler dimension %4 for %2 at token %3 of %1 program.","3665":"AGAL validation failed: Unknown filter mode in sampler: %4 for %2 at token %3 of %1 program.","3666":"AGAL validation failed: Unknown mipmap mode in sampler: %4 for %2 at token %3 of %1 program.","3667":"AGAL validation failed: Unknown wrapping mode in sampler: %4 for %2 at token %3 of %1 program.","3668":"AGAL validation failed: Unknown special flag used in sampler: %4 for %2 at token %3 of %1 program.","3669":"Bad input size.","3670":"Buffer too big.","3671":"Buffer has zero size.","3672":"Buffer creation failed. Internal error.","3673":"Cube side must be [0..5].","3674":"Miplevel too large.","3675":"Texture format mismatch.","3676":"Platform does not support desired texture format.","3677":"Texture decoding failed. Internal error.","3678":"Texture needs to be square.","3679":"Texture size does not match.","3680":"Depth texture not implemented yet.","3681":"Texture size is zero.","3682":"Texture size not a power of two.","3683":"Texture too big (max is %1x%1).","3684":"Texture creation failed. Internal error.","3685":"Could not create renderer.","3686":"'disabled' format only valid with a null vertex buffer.","3687":"Null vertex buffers require the 'disabled' format.","3688":"You must add an event listener for the context3DCreate event before requesting a new Context3D.","3689":"You can not swizzle second operand for %2 at token %3 of %1 program.","3690":"Too many draw calls before calling present.","3691":"Resource limit for this resource type exceeded.","3692":"All buffers need to be cleared every frame before drawing.","3693":"AGAL validation failed: Sampler register must be used for second operand in texture instructions for %2 at token %3 of %1 program.","3694":"The object was disposed by an earlier call of dispose() on it.","3695":"A texture can only be bound to multiple samplers if the samplers also have the exact same properties. Mismatch at samplers %1 and %2.","3696":"AGAL validation failed: Second use of sampler register needs to specify the exact same properties. At token %3 of %1 program.","3697":"A texture is bound on sampler %1 but not used by the fragment program.","3698":"The back buffer is not configured.","3699":"Requested Operation failed to complete","3700":"A texture sampler binds an incomplete texture. Make sure to upload(). All miplevels are required when mipmapping is enabled.","3701":"The output color register can not use a write mask. All components must be written.","3702":"Context3D not available.","3703":"AGAL validation failed: Source swizzle must be scalar (one of: xxxx, yyyy, zzzz, wwww) for %2 at token %3 of %1 program.","3704":"AGAL validation failed: Cube map samplers must enable mipmapping for %2 at token %3 of %1 program.","3705":"Cubemap texture too big (max is 1024x1024).","3706":"Scissor rectangle is set but does not intersect the framebuffer.","3707":"Property can not be set in non full screen mode.","3708":"Feature not available on this platform.","3709":"The depthAndStencil flag in the application descriptor must match the enableDepthAndStencil Boolean passed to configureBackBuffer on the Context3D object.","3710":"Requested Stage3D Operation failed to complete.","3711":"The streaming levels is too large.","3712":"Rendering to streaming textures is not allowed.","3713":"Incomplete streaming texture (base level not uploaded) used with no mip sampling.","3714":"ApplicationDomain.domainMemory is not available.","3715":"Too many instructions used in native shader. Detected %3 but can only support %2 for %1 program.","3716":"Too many ALU instructions in native shader. Detected %3 but can only support %2 for %1 program.","3717":"Too many texture instructions in native shader. Detected %3 but can only support %2 for %1 program.","3718":"Too many constants used in native shader. Detected %3 but can only support %2 for %1 program.","3719":"Too many temporary registers used in native shader. Detected %3 but can only support %2 for %1 program.","3720":"Too many varying registers used in native shader. Detected %3 but can only support %2 for %1 program.","3721":"Too many indirect texture reads in native shader. Detected %3 but can only support %2 for %1 program.","3722":"Event.FRAME_LABEL event can only be registered with FrameLabel object.","3723":"Invalid Context3D bounds. Context3D instance bounds must be contained within Stage bounds in constrained mode. Requested Context3D bounds were (%1,%2,%3,%4), stage bounds are (%5,%6,%7,%8).","3724":"This call requires a Context3D that is created with the extended profile.","3725":"The requested AGAL version (%2) is not valid under the Context3D profile. For example AGAL version 2 requires extended profile.","3726":"AGAL validation failed: Opcode %2 requires AGAL version to be at least 2, at token %3 of %1 program.","3727":"Failed to obtain authorization token.","3728":"When rendering to multiple textures slot 0 must be active. When rendering to the back buffer all render to texture slots must be disabled.","3729":"When rendering to multiple textures all textures must have the same dimension and render settings.","3730":"When rendering to multiple textures the same texture (or cube map face) may not be bound into multiple slots.","3731":"This feature is not available within this context.","3732":"Worker.terminate is only available for background workers.","3735":"This API cannot accept shared ByteArrays.","3736":"MessageChannel is not a sender.","3737":"MessageChannel is not a receiver.","3738":"MessageChannel is closed.","3739":"AGAL validation failed: Open conditional block at end of %1 program.","3740":"AGAL validation failed: Texture samplers used in the TED instruction can not specify a lod bias. At token %3 of %1 program.","3741":"AGAL validation failed: TEX instructions in an if block can not use computed texture coordinates. Either use interpolated texture coordinates or use the TED instruction instead. At token %3 of %1 program.","3742":"AGAL validation failed: DDX and DDY opcodes are not allowed inside conditional blocks. At token %3 of %1 program.","3743":"AGAL validation failed: The TED opcode must enable mip mapping. At token %3 of %1 program.","3744":"AGAL validation failed: Color output written to multiple times. At token %3 of %1 program.","3745":"Compressed texture size is too small. The minimum size for compressed textures is 4x4.","3746":"Rendering to compressed textures is not allowed.","3747":"Multiple application domains are not supported on this operating system.","3748":"AGAL validation failed: Empty conditional branch in AGAL of %1 program.","3749":"AGAL validation failed: Depth output register index out of bounds for %2 at token %3 of %1 program.","3750":"AGAL validation failed: Depth output register is only available in fragment programs.","3751":"AGAL validation failed: Output registers can not be written inside conditionals.","3752":"AGAL validation failed: Broken else chain.","3753":"Rectangle or cube textures require textures sampling to be set to clamp.","3754":"Texture sampler dimensions mismatch. The AGAL declaration has to match the texture used.","3755":"Rectangle textures have to disable mip mapping and can not have a lod bias set.","3756":"AGAL validation failed: Depth output must set only x as a write mask. At token %3 of %1 program.","3757":"AGAL validation failed: Vertex and fragment program need to have the same version.","3758":"AGAL validation failed: Conditional source are exactly the same, condition is constant. At token %3 of %1 program.","3759":"The selected texture format is not valid in this profile.","3760":"The color output index is out of range.","3761":"The bit depth of all textures used for render to texture must be exactly the same.","3762":"This texture format is not supported for rectangle textures.","3763":"Sampler %1 binds a texture that that does not match the read mode specified in AGAL. Reading compressed or single/dual channel textures must be explicitly declared.","3764":"Reloading a SWF is not supported on this operating system.","3765":"This call requires a Context3D that is created with the baseline or baselineExtended profile.","3766":"RectangleTexture too big (max is the larger of %1x%1 or the size of the backbuffer)."};
    	
    	private var includedLibraries: * = [JPGEncoder, PNGEncoder];
    
    	private var instanceToString: Dictionary = new Dictionary(false);
    	private var stringToInstance: Dictionary = new Dictionary(false);
    	
    	private var instanceId: int = 0;
    	
    	private var flashVars: Object = null;
    
    	private var debugging: Boolean = false;

		private var throttleState: String = "";
    	
    	private function newInstanceString(typeName: String): String {
		    var chars: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   		    var result: String = "";
		    for (var i: int = 0; i < 8; i++)
		    	result += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
		    instanceId++;
		    return "__FLASHOBJ__" + typeName + "__" + result + "__" + instanceId;
		}
		
		private function serializeError(error: Error): String {
			return "__FLASHERR__" + error.toString() + (errors[error.errorID] ? ": " + errors[error.errorID] : "");
		}
		
        public function Main() {
        	flashVars = LoaderInfo(root.loaderInfo).parameters;
        	if (flashVars.hasOwnProperty("debug"))
	        	debugging = true;
        	debug("Begin Initialize");
        	Security.allowDomain("*");
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
        	ExternalInterface.addCallback("create_callback_object", create_callback_object);        	
        	ExternalInterface.addCallback("create_callback_function", create_callback_function);
        	ExternalInterface.addCallback("main", main);
        	ExternalInterface.addCallback("echo", echo);
			ExternalInterface.addCallback("throttle", throttle)
			stage.addEventListener(ThrottleEvent.THROTTLE, onThrottleEvent);
        	if (flashVars.hasOwnProperty("ready")) {
	        	setTimeout(function ():void {
	        		ExternalInterface.call(flashVars.ready);
	        	}, 0);        	
        	}
        	debug("End Initialize");
        }

		private function onThrottleEvent(e: ThrottleEvent): void {
			throttleState = e.state;
		}

        private const SERIALIZE_INSTANCE: int = 0;
        private const SERIALIZE_AUTO: int = 1;
        private const SERIALIZE_JSON: int = 2;
        
        public function serialize(value: *, objectSerialize: int = SERIALIZE_AUTO): * {
        	if (typeof(value) != "object" && typeof(value) != "function")
        		return value;
        	var cls: String = value == this ? flash.utils.getQualifiedSuperclassName(value) : flash.utils.getQualifiedClassName(value);
        	if (objectSerialize == SERIALIZE_JSON || (objectSerialize == SERIALIZE_AUTO && (cls == "Object" || cls == "Array"))) {
				var encoded: Object = new Object();
				for (var key: * in value)
					encoded[key] = value[key];
				return encoded;
        	}
        	if (cls == "Array") {
        		var result: Array = new Array();
        		for (var i: int = 0; i < value.length; ++i)
        			result.push(serialize(value[i], objectSerialize));
        		return result;
        	} else {
        		if (!instanceToString.hasOwnProperty(value)) {
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
        		debug("Begin Instantiate " + className);
	        	var myClass: Class = getDefinitionByName(className) as Class;
				var myInstance: *;
				if (args.length == 0)
					 myInstance = new myClass();
				else if (args.length == 1)
					myInstance = new myClass(unserialize(args[0]));
				else if (args.length == 2)
					myInstance = new myClass(unserialize(args[0]), unserialize(args[1]));
				debug("End Instantiate " + className);
	        	return serialize(myInstance);
        	} catch(error: Error) {
        		debug("Error Instantiate " + className);
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
				object[method] = function (argument: *): void {
					var argumentSerialized: * = serialize(argument);
					ExternalInterface.call(callback, argumentSerialized);
					destroy(argumentSerialized);
				};
				return serialize(object, SERIALIZE_INSTANCE);
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }
        
        public function create_callback_function(callback: String): String {
			try {
				var object: Function = function (argument: *): void {
					var argumentSerialized: * = serialize(argument);
					ExternalInterface.call(callback, argumentSerialized);
					destroy(argumentSerialized);
				};
				return serialize(object, SERIALIZE_INSTANCE);
        	} catch(error: Error) {
        		return serializeError(error);
        	}
        	return null;
        }
        
    	public function echo(data: String): String {
    		return data;
    	}

		public function throttle(): String {
			return throttleState;
		}

        public function debug(s: String): void {
        	if (debugging)
        		ExternalInterface.call("console.log", s);
        }

    }
    
}
