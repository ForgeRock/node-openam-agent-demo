var express = require('express'),
    swig = require('swig'),
    openamAgent = require('openam-agent'),
    SimpleCache = require('openam-agent-cache-simple').SimpleCache,
    MemcachedCache = require('openam-agent-cache-memcached').MemcachedCache,
    CouchDBCache = require('openam-agent-cache-couchdb').CouchDBCache,
    RedisCache = require('openam-agent-cache-redis').RedisCache,
    MongoCache = require('openam-agent-cache-mongodb').MongoCache,
    config = require('./config.json');


config.sessionCache = new SimpleCache({
    expiresAfterSeconds: 60
});


// config.sessionCache = new MongoCache({
//    url: 'mongodb://localhost/agent',
//    expiresAfterSeconds: 60,
//    collectionName: 'agenttestcache1'
// });
//
// config.sessionCache = new MemcachedCache({
//    url: 'localhost:11211',
//    expiresAfterSeconds: 60
// });
//
// config.sessionCache = new RedisCache({
//    url: 'localhost:27017',
//    expiresAfterSeconds: 60
// });
//
// config.sessionCache = new CouchDBCache({
//    host: 'localhost',
//    port: 5984,
//    auth: {
//        username: 'admin',
//        password: 'cangetin'
//    }
// });

var pkg = require('./node_modules/openam-agent/package.json'),
    app = express(),
    agent = new openamAgent.PolicyAgent(config);

var cookieShield = new openamAgent.CookieShield({getProfiles: true, cdsso: false, noRedirect: false}),
    passThroughShield = new openamAgent.CookieShield({getProfiles: true, passThrough: true}),
    policyShield = new openamAgent.PolicyShield(config.appName),
    oauth2Shield = new openamAgent.OAuth2Shield(),
    basicAuthShield = new openamAgent.BasicAuthShield();

//app.use(agent.cdsso());

// app routes
app.get('/', function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/index.html')({
        pkg: pkg
    }));
});

app.get('/public', function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/public.html')({
        pkg: pkg,
        session: req.session,
        page: 'public'
    }));
});

app.get('/passthrough', agent.shield(passThroughShield), function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/passthrough.html')({
        pkg: pkg,
        session: req.session,
        page: 'passthrough'
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


// you can use a shield for an entire router, but make sure to mount the router after other routes, otherwise the
// shield middleware will be used for everything else mounted under the same path as the router.

var router = express.Router();
router.use(agent.shield(cookieShield));

router.use('/members', function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/members.html')({
        pkg: pkg,
        session: req.session,
        page: 'members'
    }));
});

router.get('/admin', agent.shield(policyShield), function (req, res) {
    res.send(swig.compileFile(__dirname + '/public/admin.html')({
        pkg: pkg,
        session: req.session,
        page: 'admin'
    }));
});

app.use('/', router);

// mount the notifications middleware
app.use(agent.notifications());

agent.on('session', function (session) {
    console.log('A user\'s session has changed!', session);
});

var server = app.listen(8080, function () {
    console.log('Server started on port %d', server.address().port);
});
