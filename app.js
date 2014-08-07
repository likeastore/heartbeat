var config = require('./config');
var hearbeat = require('./source/hearbeat');

hearbeat(config).start(function (err, monitor) {
	console.log('hearbeat server started');
	console.log(monitor);
});
