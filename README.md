node-openam-agent-demo
======================

This is a demo applicaion that showcases the [node-openam-agent](https://github.com/zoltantarcsay/node-openam-agent) package.

Prerequisites
-------------
This demo requires a running instance of OpenAM 12.0.0 with the following bits of configuration:
* A realm with users
* A policy agent profile (an agent profile of type "2.2 Agent" will suffice since the configuration is stored locally)
* An entitlement application with a policy for the "/admin" resource
* A configured OAuth2 server in a realm with an OAuth 2.0 agent profile

Installation
------------
Clone with git and install the local npm packages:

```bash
$ git clone git@github.com:zoltantarcsay/node-openam-agent-demo.git
...
$ cd node-openam-agent-demo
$ npm install
...
```

Configuration
-------------
Before running the app, update `config.json` with the correct settings in your environment.

```javascript
{
  "serverUrl": "http://openam.example.com:8080/openam", // the base URL of your OpenAM deployment
  "appUrl": "http://app.example.com:8080",              // the base URL of the demo app (needed for notifications)
  "notificationRoute": "/",                             // the root path where the notification middleware is attached
  "notificationsEnabled": true,
  "username": "demo-agent",                             // the agent's user name
  "password": "changeit",                               // the agent's password
  "realm": "/",                                         // the agent's realm
  "appName": "demo-app",                                // the name of the entitlement application used for the PolicyShield
  "logLevel": "info"
}
```

Starting the app
----------------
Start the app from the command line:

```bash
$ npm start # the same as: node index.js
2015-10-04T09:54:30.014Z - info: [EyUuLkq1l] Agent initialized.
Server started on port 8080
```

The Application
---------------
This demo is an [Express](http://expressjs.com/) application whose paths are protected in various ways with a PolicyAgent. Most paths return HTML.

### Paths

#### /
The root path of the application returns an unprotected landing page.

#### /members
Another HTML resource, protected by the CookiShield (it only requires a valid OpenAM session, but doesn't enfoce any policies -- the equivalent of "SSO only mode"). The agent fetches the user's profile from OpenAM and puts it in the request object.

#### /admin
An HTML page that is protected by both the CookiShield and the PolicyShield. It can only be accessed if allowed by policies.

#### /mobile
An unprotected HTML page that lets you test the `/api/mobile` resource from your browser.

#### /api/mobile
A JSON resource that is protected by the OAuth2Shield and can only be accessed with a valid access_token. The agent gets the tokeninfo resource from OpenAM and puts it in the request object. Further validation can be done with a custom middleware, e.g. by comparing the list of scopes in the tokeninfo to resource path.

#### /basic
A plain text resource protected by the BasicAuthShield. The username and password must be sent for each request and they will be validated by the agent without creating new user sessions in OpenAM. This feature can be useful for clients that don't support cookies or OAuth2.
