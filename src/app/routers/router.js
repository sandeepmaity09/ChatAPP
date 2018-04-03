const joinLocationController = require('../controllers/joinLocationController');


module.exports = function (app) {
    app.get('/joinLocationAPI', joinLocationController);
}