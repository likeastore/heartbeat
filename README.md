# Heartbeat

Health monitoring of HTTP services and databases.

## Requirements

* [MongoDB](http://mongodb.org)
* [NodeJS](http://nodejs.org) > 0.10.x
* [Mandrill](https://mandrillapp.com)
* [Twilio](https://www.twilio.com/) 

You decide what to use for notifications, `Mandrill` (emails), `Twilio` (sms) or both. 

## How to use

Clone the repo and install dependenices,

```bash
$ git clone git://github.com/likeastore/heartbeat
$ cd heartbeat
$ npm install
```

Create `index.js` in [/config](/config) folder,

```js
module.exports = {
	connection: 'mongodb://localhost:27017/heartbeatdb',

	interval: 10000,

	logentries: {
		token: null
	},

	monitor: {
		http: [
			{
				url: 'https://likeastorea.com'
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
```

Start heart beating,

```bash
$ node app.js
```

## API

### Connection

Connection string to `MongoDB` to store heartbeat results.

```js
connection: 'mongodb://localhost:27017/heartbeatdb',
```

### Interval

The period of time between heartbeats,

```js
interval: 5000
````

### Monitor

Monitoring options. There are few strategies of heartbeating implemented now.

#### HTTP

HTTP/HTTPS requests, measure the request execution time and compare to `!== 200` response code.

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

#### JSON

HTTP/HTTPS requests for JSON API's.

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

#### MongoDB

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

#### Resolve

Resolves given `dns` name into ip addresses and pings each address.

```js
resolve: [
	{
		name: 'google.com'
	}
]
```

#### Ping 

Pings given `ip` address.

```js
ping: [
	{
		ip: '37.139.9.95'
	}
]
```

#### Planned

* [MySQL]()
* [Redis]()
* [REST hooks]()

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
	sid: "twilio_sid",
	token: "twilio_access_token"
}
```

## License (MIT)

Copyright (c) 2014, Likeastore.com info@likeastore.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
