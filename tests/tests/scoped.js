test("test unresolved", function () {
	QUnit.deepEqual(Scoped.unresolved("global:BetaJS.Flash"), []);
});

test("test flash installed", function () {
	QUnit.equal(BetaJS.Browser.Info.flash().installed(), true, "Flash installed");
});

test("test flash version", function () {
	var version = BetaJS.Browser.Info.flash().version();
	ok(version.major >= 11, "Major Flash Version >= 11");
	ok(version.major >= 12 || version.minor >= 2, "Minor Flash Version >= 2");
});