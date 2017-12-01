
const router = require('express').Router();
const mongoRequests = require('../dbQueries/mongodb/queries');
const texts = require('../texts');

router.get('/favicon.ico', (req, res) => res.sendStatus(200));

router.post('/login', (req, res, next) => {
    if (req.body.email && req.body.password) {
        mongoRequests.login(req.body, (err, result) => {
            if (err) return next(err);
            res.send(result);
        });
        return;
    }
    return res.send({ error: true, message: texts.validationError });
});

router.post('/register', (req, res, next) => {
    if (req.body.email && req.body.password) {
        mongoRequests.register(req.body, (err, result) => {
            if (err) return next(err);
            res.send(result);
        });
        return;
    }
    return res.send({ error: true, message: texts.validationError });
});

module.exports = router;
