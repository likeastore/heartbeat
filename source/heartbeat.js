var async = require('async');
var logger = require('./utils/logger');
var db = require('./db');

var beats = require('./beats');
var notifiers = require('./notifiers');

function heart(type, options) {
	var beat = beats[type];

	if (!beat) {
		throw new Error('missing beat type for: ' + type);
	}

	return function (callback) {
		//beat(options, callback);
		beat.call(beats, options, callback);
	};
}

function notify(type, options) {
	var notif = notifiers[type];

	if (!type) {
		throw new Error('missing notifier type for: ' + type);
	}

	return function (failures, callback) {
		async.each(failures, function (failure, callback) {
			notif(options, failure, callback);
		}, callback);
	};
}

function notification(options) {
	var notifications = Object.keys(options).map(function (k) {
		return notify(k, options[k]);
	});

	return function (failures, callback) {
		async.each(notifications, function (notification, callback) {
			notification(failures, callback);
		}, callback);
	};
}

function job(type, array, notify, db) {
	var hearts = array.map(function (e) {
		return heart(type, e);
	});

	return function (callback) {
		async.parallel(hearts, function (err, results) {
			if (err) {
				return callback(err);
			}

			// save job results and notify failures..
			db.heartbeats.insert(results, function (err) {
				if (err) {
					return callback(err);
				}

				var failures = results.filter(function (r) {
					return !r.success;
				});

				notify(failures, callback);
			});

		});
	};
}

function heartbeat(config) {
	if (!config) {
		throw new Error('config is missing');
	}

	if (!config.monitor) {
		throw new Error('config.monitor section is missing');
	}

	if (!config.notify) {
		throw new Error('config.notify section is missing');
	}

	var local = db(config);
	var notify = notification(config.notify);
	var jobs = Object.keys(config.monitor).map(function (k) {
		return job(k, config.monitor[k], notify, local);
	});

	return {
		start: function () {
			// heartbeating cycle..
			(function cycle() {
				async.series(jobs, function (err) {
					if (err) {
						logger.error(err);
					}

					var interval = config.interval || 10000;
					logger.info('heartbeat interval over, restarting after ' + interval + ' msec.');

					setTimeout(cycle, interval);
				});
			})();
		}
	};
}

module.exports = heartbeat;
