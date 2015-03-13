			BetaJS.Async.waitFor = function () {
				var args = BetaJS.Functions.matchArgs(arguments, {
					condition: true,
					conditionCtx: "object",
					callback: true,
					callbackCtx: "object",
					interval: "int"
				});console.log(args);
				var h = function () {
					try {
						return !!args.condition.apply(args.conditionCtx || args.callbackCtx || this);
					} catch (e) {
						
						return false;
					}
				};
				if (h())
					args.callback.apply(args.callbackCtx || this);
				else {
					var timer = setInterval(function () {
						if (h()) {
							clearInterval(timer);
							args.callback.apply(args.callbackCtx || this);
						}
					}, args.interval || 1);
				}
			};
