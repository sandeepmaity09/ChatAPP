/*
 Third Party Libraries
*/
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');


/**
 * Server Configuration
 */
const config = require('./src/config');

/**
 * environment:
 */
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
// const mappedRoutes = mapRoutes(config.routes,'src/app/controllers/');


// ROUTES

// app.get('/joinLocationAPI', joinLocationController)
require('./src/app/routers/router')(app);

app.use(cors());

// app.use('/app', mappedRoutes);

console.log(config.port);

server.listen(config.port, function () {
    // if (environment !== 'production' &&
    //     environment !== 'development' &&
    //     environment !== 'testing'
    // ) {
    //     console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    //     process.exit(1);
    // }
    console.log('Server is listening at port ', config.port);
});
