// execute query and measure reponse time
var logger = require('../utils/logger');
var mongo = require('mongojs');

module.exports = function mongo (options, callback) {
	var connection = options.connection, started = new Date();
	var db = mongo.connect(connection, options.collections);
	if (!db) {
		return callback(null, {success: false, url: connection, message: 'failed to connect database'});
	}

	logger.info('mongo query:' + connection);

	options.query(db, function (err) {
		var time = new Date() - started;

		db.close();

		var report = err ?
			{success: false, url: connection, at: new Date(), responseTime: time, message: 'mongo failed', err: err} :
			{success: true, url: connection, at: new Date(), responseTime: time};

		report.success ? logger.success(report) : logger.error(report);

		callback(null, report);
	});
};
