var config = require('./config');
var hearbeat = require('./source/hearbeat');

hearbeat(config).start();
