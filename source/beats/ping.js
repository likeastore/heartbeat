// pings the ip address
var logger = require('../utils/logger');
var ping = require('tcp-ping');

module.exports = function ping (options, callback) {
	var ip = options.ip;

	logger.info('ping: ' + ip);

	var started = new Date();

	ping.probe(ip, 80, function (err, resolved) {
		var time = new Date() - started;

		var report = (err || !resolved) ?
			{success: false, url: ip, responseTime: time, at: new Date(), message: 'ping failed', err: err} :
			{success: true, url: ip, responseTime: time, at: new Date()};

		report.success ? logger.success(report) : logger.error(report);

		callback(null, report);
	});
};
