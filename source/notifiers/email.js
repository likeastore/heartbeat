var logger = require('../utils/logger');
var transport = require('../transport');

module.exports = function email (options, failure, callback) {
	var text = JSON.stringify(failure);
	var subject = '[Heartbeat] Service ' + failure.url + ' failed.';
	var from = options.from;
	var to = options.to.map(function (t) {
		return {email: t};
	});

	var message = {
		text: text,
		subject: subject,
		from_email: from,
		to: to
	};

	logger.info('sending mandrill notification');

	transport.mandrill('/messages/send', {
		message: message
	}, callback);
};
