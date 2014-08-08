var _ = require('underscore');
var async = require('async');
var request = require('request');
var mongo = require('mongojs');
var logger = require('./utils/logger');

var beats = {
	// pings URL and measure the response time
	ping: function (options, callback) {
		var url = options.url, started = new Date();

		logger.info('ping: ' + url);

		request({url: options.url}, function (err, resp, body) {
			if (err) {
				return callback({message: 'ping failed', url: url, err: err});
			}

			if (resp.statusCode !== 200) {
				return callback({message: 'ping failed', url: url, statusCode: resp.statusCode});
			}

			var report = {url: url, responseTime: new Date() - started, statusCode: resp.statusCode};
			logger.success(report);

			callback(null, report);
		});
	},

	// requests URL and compare jsons
	json: function (options, callback) {
		var url = options.url, started = new Date(), expected = options.response;

		logger.info('json:' + url);

		request({url: options.url, json: true}, function (err, resp, body) {
			if (err) {
				return callback({message: 'json failed', url: url, err: err});
			}

			if (resp.statusCode !== 200) {
				return callback({message: 'json failed', url: url, statusCode: resp.statusCode});
			}

			if (!_.isEqual(body, expected)) {
				return callback({message: 'json failed', url: url, expected: expected, actual: body});
			}

			var report = {url: url, responseTime: new Date() - started, statusCode: resp.statusCode};
			logger.success(report);

			callback(null, report);
		});
	},

	// execute query and measure reponse time
	mongo: function (options, callback) {
		var connection = options.connection, started = new Date();
		var db = mongo.connect(connection, options.collections);
		if (!db) {
			return callback({message: 'failed to connect db', connection: options.connection});
		}

		logger.info('mongo query:' + connection);

		options.query(db, function (err) {
			if (err) {
				return callback({message: 'db failed', connection: connection, err: err});
			}

			db.close();

			var report = {connection: connection, responseTime: new Date() - started};
			logger.success(report);

			callback(null, report);
		});
	}
};

function heart(type, options) {
	var beat = beats[type];

	if (!beat) {
		throw new Error('missing beat type for: ' + type);
	}

	return function (callback) {
		beat(options, callback);
	};
}

function notification(options) {

}

function job(type, array, notifications) {
	var hearts = array.map(function (e) {
		return heart(type, e);
	});

	return function (callback) {
		async.parallel(hearts, callback);
	};
}

function hearbeat(config) {
	if (!config) {
		throw new Error('config is missing');
	}

	if (!config.monitor) {
		throw new Error('config.monitor section is missing');
	}

	if (!config.notify) {
		throw new Error('config.notify section is missing');
	}

	var notifications = Object.keys(config.notify).map(function (k) {
		return notification(config.notify[k]);
	});

	var jobs = Object.keys(config.monitor).map(function (k) {
		return job(k, config.monitor[k], notifications);
	});

	return {
		start: function (callback) {
			callback = callback || function () {};

			// heartbeating cycle..
			(function cycle() {
				async.series(jobs, function (err) {
					if (err) {
						logger.error(err);
					}

					setTimeout(cycle, config.interval);
				});
			})();
		}
	};
}

module.exports = hearbeat;
