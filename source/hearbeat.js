var async = require('async');
var request = require('request');
var mongojs = require('mongojs');

function heart(type, options) {
	var beats = {
		// pings URL and measure the response time
		ping: function (options, callback) {
			var url = options.url, started = new Date();
			request({url: options.url}, function (err, resp, body) {
				if (err) {
					return callback({message: 'ping failed', url: url, err: err});
				}

				if (resp.statusCode !== 200) {
					return callback({message: 'ping failed', url: url, statusCode: resp.statusCode});
				}

				callback(null, {url: url, responseTime: new Date() - started, statusCode: resp.statusCode});
			});
		},

		// requests URL and compare jsons
		json: function (options, callback) {
			var url = options.url, started = new Date(), expected = options.response;
			request({url: options.url, json: true}, function (err, resp, body) {
				if (err) {
					return callback({message: 'json failed', url: url, err: err});
				}

				if (resp.statusCode !== 200) {
					return callback({message: 'json failed', url: url, statusCode: resp.statusCode});
				}

				// TODO: use deep equal here.. underscore?
				if (body !== expected) {
					return callback({message: 'json failed', url: url, expected: expected, actual: body});
				}

				callback(null, {url: url, responseTime: new Date() - started, statusCode: resp.statusCode});
			});
		},

		// execute query and measure reponse time
		mongo: function (options, callback) {
			throw 'not implemented';
		}
	};

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
		console.log('executing', type, 'beats..');
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

	var notifications = Object.keys(config.monitor).map(function (k) {
		return notification(config.notification[k]);
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
						console.log(err);
					}

					setTimeout(cycle, config.interval);
				});
			})();
		}
	};
}

module.exports = hearbeat;
