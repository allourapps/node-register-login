
/**
 * Module Dependencies
 */

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const winston = require('winston');
const config = require('./config');

/**
 * Set Node Env Mode
 */

process.env.NODE_ENV = config.mode;

const app = express();

/**
 * Set View Engine
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Other Middleware
 */

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes');
const api = require('./routes/api');

app.use('/', index);
app.use('/api', api);

/**
 * Middleware For Not Found Route
 */

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error Handlers
 * Development Error Handler
 */

if ('development' === process.env.NODE_ENV) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({ message: err.message, error: err });
    });
}

/**
 * Production Error Handler
 */

app.use((err, req, res, next) => {
    if (404 !== err.status) winston.log('error', err);
    res.status(err.status || 500);
    res.json({ error: true, message: err.message });
});

/**
 * Application Listening On PORT
 */

app.listen(config.port, winston.log('info', `Node.js server is running at http://localhost:${config.port} 
    in ${process.env.NODE_ENV} mode with process id ${process.pid}`)
);

/**
 * Checking Uncaught Exceptions
 */

process.on('uncaughtException', err => {
    winston.log('error', (new Date()).toUTCString() + ' uncaughtException:', err.message);
    winston.log('info', err.stack);
    process.exit(1);
});
