var http = require('http'),
    openamAgent = require('@forgerock/openam-agent'),
    PolicyAgent = openamAgent.PolicyAgent,
    CookieShield = openamAgent.CookieShield;

var agent = new PolicyAgent(require('../config.json')),
    shield = new CookieShield({
        getProfiles: true,
        noRedirect: true
    });


var server = http.createServer(function (req, res) {
    var middleware = agent.shield(shield);

    if (req.url === '/members') {
        // enforce shield
        middleware(req, res, function () {
            // app logic
            res.writeHead(200);
            res.end('Hello ' + req.session.data.username + '!');

        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(3000, function () {
    console.log('Example 1 started on port %s', server.address().port);
});
