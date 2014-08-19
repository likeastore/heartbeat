module.exports = {
	connection: 'mongodb://localhost:27017/heartbeatdb',

	interval: 10000,

	logentries: {
		token: null
	},

	monitor: {
		http: [
			{
				url: 'https://likeastore.com'
			},
			{
				url: 'https://stage.likeastore.com'
			}
		],

		json: [
			{
				url: 'https://app.likeastore.com/api/monitor',
				response: {
					"app":"app.likeastore.com",
					"env":"production",
					"version":"0.0.52",
					"apiUrl":"/api"
				}
			}
		],

		mongo: [
			{
				connection: 'mongodb://localhost:27017/likeastoredb',
				collections: ['users'],
				query: function (db, callback) {
					db.users.findOne({email: 'alexander.beletsky@gmail.com'}, callback);
				}
			}
		],

		resolve: [
			{
				name: 'google.com'
			}
		],

		ping: [
			{
				ip: '37.139.9.95'
			}
		]
	},

	// notification options
	notify: {
		email: {
			from: 'heartbeat@likeastore.com',
			to: ['devs@likeastore.com']
		},

		sms: {
			to: ['+3805551211', '+3805551212']
		}
	},

	transport: {
		mandrill: {
			token: 'fake-token'
		},

		twilio: {
			sid: 'fake-sid',
			token: 'fake-token'
		}
	}
};
