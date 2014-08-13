# Heartbeat

Health monitoring of HTTP services and databases.

## Requirements

* [NodeJS](http://nodejs.org) > 0.10.x
* [Mandrill](https://mandrillapp.com)
* [Twilio](https://www.twilio.com/) **optional**

## How to use

Clone the repo,

```bash
$ git clone git://github.com/likeastore/heartbeat
```

Create `index.js` in [/config](/config) folder,

```js
module.exports = {
	interval: 5000,

	logentries: {
		token: null
	},

	// configure monitoring options
	monitor: {

		ping: [
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
		]
	},

	// notification options
	notify: {
		email: {
			to: 'devs@likeastore.com'
		},

		sms: {
			to: ['+3805551211', '+3805551212']
		}
	},

	transport: {
		mandrill: {
			token: null
		},

		twilio: {
			token: null
		}
	}
};
```

Start heart beating,

```bash
$ node app.js
```

## API

There are few strategies of heartbeating implemented now.

### Interval

The period of time between heartbeats,

```js
interval: 5000
````

### Monitor

Monitoring options.

#### Ping

Site ping, measure the request execution time and compare to `!== 200` response code.

```js
ping: [
	{
		url: 'https://likeastore.com'
	},
	{
		url: 'https://stage.likeastore.com'
	}
]
```

#### Json

Suites for `json` API's with endpoints to check it's state.

```js
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
```

#### Mongo

For MongoDB checking, to run any query:

```js
mongo: [
	{
		connection: 'mongodb://localhost:27017/likeastoredb',
		collections: ['users'],
		query: function (db, callback) {
			db.users.findOne({email: 'alexander.beletsky@gmail.com'}, callback);
		}
	}
]
```

### Transport

To be able to send and receive emails and sms, `mandrill` and `twilio` accounts have to be setup.

#### Mandril token

Mandrill access token,

```js
mandrill: {
	token: "mandrill_access_token"
},
```

#### Twilio token 

Twilio access token,

```js
twilio: {
	token: "twilio_access_token"
}
```

### Planned

* [MySQL]()
* [Redis]()

## License (MIT)

Copyright (c) 2014, Likeastore.com info@likeastore.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
