const {PolicyAgent, Shield, ShieldEvaluationError, CookieShield} = require('@forgerock/openam-agent');
const express = require('express');
const config = require('../config.json');

class CustomerShield extends Shield {
    evaluate(req, res, agent) {
        const rolesProperty = 'roles';

        return new Promise((resolve, reject) => {
            if (!req.session) {
                reject(new ShieldEvaluationError(401, 'no session'));
            }

            if (!req.session.data) {
                reject(new ShieldEvaluationError(403, 'no profile'));
            }

            if (!Array.isArray(req.session.data[rolesProperty])) {
                reject(new ShieldEvaluationError(403, 'no roles'));
            }

            if (!req.session.data[rolesProperty].includes('customer')) {
                reject(new ShieldEvaluationError(403, 'not a customer'));
            }

            resolve();
        });
    }
}

const agent = new PolicyAgent(config);
const app = express();

app.use(agent.shield(new CookieShield({getProfiles: true})));
app.use(agent.shield(new CustomerShield()));
app.use((req, res) => {
    res.send(`Hello, ${req.session.data.uid}`);
});

app.listen(3000, () => console.info('App is running...'));
