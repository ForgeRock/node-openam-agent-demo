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

Examples
--------
- Example 1: Simple app with a vanilla Node.js HttpServer
- Example 2: Rich HTML website using [Express](http://expressjs.com/)


Configuration
-------------
Before running the app, update `config.json` with the correct settings in your environment.

```json
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
2016-12-02T14:14:50.486Z - info: [rkMyfbJXl] Agent initialized.
2016-12-02T14:14:50.507Z - info: [HygMkG-JXg] Agent initialized.
Example 1 started on port 8080
```

`npm start` runs example1 by default. To run example2 (etc.), run `npm start -- example2` or `node lib/example2`
  