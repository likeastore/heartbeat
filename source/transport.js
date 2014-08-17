var mandrill = require('node-mandrill');
var twilio = require('twilio');
var config = require('../config');

var setupMandrill = function () {
	if (!validConfig()) {
		throw new Error('missing mandrill token, please update config.transport.mandrill section');
	}

	return mandrill(config.transport.mandrill.token);

	function validConfig() {
		return config.transport.mandrill && config.transport.mandrill.token;
	}
};

var setupTwilio = function () {
	if (!validConfig()) {
		throw new Error('missing twilio account SID or auth Token, please update config.transport.twilio section');
	}

	return twilio(config.transport.twilio.sid, config.transport.twilio.token);

	function validConfig() {
		return config.transport.twilio && (config.transport.twilio.sid && config.transport.twilio.token);
	}
};

var transport = {
	mandrill: setupMandrill(),
	twilio: setupTwilio()
};

module.exports = transport;
