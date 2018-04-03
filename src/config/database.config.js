const mysql = require('mysql');
const path = require('path');

const connection = require('./connection.config');

let database;

switch (process.env.NODE_ENV) {
    case 'production':
        database = mysql.createConnection(connection.productio);
        break;
    case 'testing':
        database = mysql.createConnection(connection.testing);
        break;
    default:
        database = mysql.createConnection(connection.development);
}

// console.log('this is ',database);
database.connect(function (err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});


module.exports = database;
