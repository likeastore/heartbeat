describe('heartbeat', function () {
	var heartbeat = require('../source/heartbeat');

	it('requires config', function () {
		assert.throws(function () {
			heartbeat();
		}, /config is missing/)
	});

	it('requires config.monitor', function () {
		assert.throws(function () {
			heartbeat({ notify: {} });
		}, /config.monitor section is missing/)
	});

	it('requires config.notify', function () {
		assert.throws(function () {
			heartbeat({ monitor: {} });
		}, /config.notify section is missing/)
	});

});
