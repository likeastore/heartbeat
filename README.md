# Heartbeat

Health monitoring of HTTP services and databases.

## Requirements

* [MongoDB](http://mongodb.org) > 2.4.x
* [NodeJS](http://nodejs.org) > 0.10.x

## How to use

Clone the repo,

```bash
$ git clone git://github.com/likeastore/heartbeat
```

Create `index.js` in [/config](/config) folder,

```js
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
```

Start heart beating,

```bash
$ node app.js
```

## API

TBD. 

## License (MIT)

Copyright (c) 2014, Likeastore.com info@likeastore.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
