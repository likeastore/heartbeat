// requests URL and compare jsons
var logger = require('../utils/logger');
var request = require('request');
var _ = require('underscore');

module.exports = function json (options, callback) {
	var url = options.url, started = new Date(), expected = options.response;

	logger.info('json:' + url);

	request({url: options.url, json: true}, function (err, resp, body) {
		var time = new Date() - started;

		var report = (err || resp.statusCode !== 200) ?
			{success: false, url: url, responseTime: time, at: new Date(), statusCode: resp && resp.statusCode, message: 'json failed', err: err} :
			{success: true, url: url, responseTime: time, at: new Date(), statusCode: resp.statusCode};

		if (!_.isEqual(body, expected)) {
			report = {success: false, url: url, expected: expected, actual: body};
		}

		report.success ? logger.success(report) : logger.error(report);

		callback(null, report);
	});
};
