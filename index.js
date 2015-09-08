var express = require('express'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    openamAgent= require('openam-agent'),
    config = require('./config.json');

var pkg = require('./node_modules/openam-agent/package.json'),
    app = express(),
    agent = new openamAgent.PolicyAgent(config);

var cookieShield = new openamAgent.CookieShield(),
    policyShield = new openamAgent.PolicyShield(config.appName),
    oauth2Shield = new openamAgent.OAuth2Shield(),
    basicAuthShield = new openamAgent.BasicAuthShield();

// app routes
app.get('/', function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/index.html')({
        pkg: pkg
    }));

});

app.use('/members', agent.shield(cookieShield), function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/members.html')({
        pkg: pkg,
        session: req.session,
        page: 'members'
    }));
});

app.get('/admin', agent.shield(cookieShield), agent.shield(policyShield), function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/admin.html')({
        pkg: pkg,
        session: req.session,
        page: 'admin'
    }));
});

app.get('/mobile', function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/mobile.html')({
        pkg: pkg,
        session: req.session,
        page: 'mobile'
    }));
});

app.get('/basic', agent.shield(basicAuthShield), function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/basic.html')({
        pkg: pkg,
        session: req.session,
        page: 'basic'
    }));
});

app.get('/api/mobile', agent.shield(oauth2Shield), function (req, res) {
    res.send({
        message: 'hello',
        tokenInfo: req.session.data
    });
});

// notifications
app.use(agent.notifications.router);

agent.notifications.on('session', function (session) {
    console.log('A user\'s session has changed!', session);
});

var server = app.listen(8080, function () {
    console.log('Server started on port %d', server.address().port);
});

