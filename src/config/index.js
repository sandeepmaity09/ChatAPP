const routes = require('./routes/routes');

module.exports = {
    keep: false,
    routes,
    port: process.env.PORT || '3000',
}