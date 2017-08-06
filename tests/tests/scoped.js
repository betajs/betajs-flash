QUnit.test("test unresolved", function (assert) {
    assert.deepEqual(Scoped.unresolved("global:BetaJS.Flash"), []);
});

QUnit.test("test flash installed", function (assert) {
    assert.equal(BetaJS.Browser.Info.flash().installed(), true, "Flash installed");
});

QUnit.test("test flash version", function (assert) {
	var version = BetaJS.Browser.Info.flash().version();
    assert.ok(version.major >= 11, "Major Flash Version >= 11");
    assert.ok(version.major >= 12 || version.minor >= 2, "Minor Flash Version >= 2");
});