var config = require('./config');
var heartbeat = require('./source/heartbeat');

heartbeat(config).start();
