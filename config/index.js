module.exports = {
	// mongo db connection
	connection: 'mongodb://localhost:27017/heartbeatdb',

	// configure monitoring options
	monitor: {

		// simple site ping, for web apps
		site: {
			url: ['https://likeastore.com', 'https://app.likeastore.com'] // array, string
		},

		// api calls with response check
		app: {
			url: 'http://app.likeastore.com/api/monitor',
			response: {
				app: "app.likeastore.com",
				env: "production",
				version: "0.0.51",
				apiUrl: "/api"
			}
		},

		// databases
		db: {
			mongo: 'mongodb://user:pass@christian.mongohq.com:212443/likeastoreproddb',
			query: {
				users: {
					findOne: {
						id: '4c5e8d9494fd0f47518dce45'
					}
				}
			}
		}
	},

	// notification options
	notify: {
		email: {
			to: 'devs@likeastore.com'
		},

		sms: {
			to: ['+3805551211', '+3805551212']
		}
	}
};
