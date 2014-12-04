// resolves all ip's by given DNS and pings each
var logger = require('../utils/logger');
var async = require('async');
var dns = require('dns');
var ping = require('tcp-ping');

module.exports = function resolve (options, callback) {
	var name = options.name;

	logger.info('resolve: ' + name);

	dns.resolve4(name, function (err, addresses) {
		if (err) {
			return callback(null, {success: false, url: name, message: 'failed resolved ip by name'});
		}

		async.map(addresses, function (address, callback) {
			var started = new Date();

			ping.probe(address, 80, function (err, resolved) {
				var time = new Date() - started;

				var report = (err || !resolved) ?
					{success: false, url: address, responseTime: time, at: new Date(), message: 'ping failed', err: err} :
					{success: true, url: address, responseTime: time, at: new Date()};

				report.success ? logger.success(report) : logger.error(report);

				callback(null, report);
			});
		}, callback);
	});
};
