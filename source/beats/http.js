// pings URL and measure the response time
var logger = require('../utils/logger');
var request = require('request');

module.exports = function http (options, callback) {
	var url = options.url, started = new Date();

	logger.info('http: ' + url);

	request({url: url}, function (err, resp, body) {
		var time = new Date() - started;

		var report = (err || resp.statusCode !== 200) ?
			{success: false, url: url, responseTime: time, at: new Date(), statusCode: resp && resp.statusCode, message: 'ping failed', err: err} :
			{success: true, url: url, responseTime: time, at: new Date(), statusCode: resp.statusCode};

		report.success ? logger.success(report) : logger.error(report);

		callback(null, report);
	});
};
