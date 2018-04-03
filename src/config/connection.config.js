const development = {
    database: 'zadmin_popboxchat',
    user: 'root',
    password: 'root',
    host: 'localhost',
    charset: 'utf8mb4',
};

const testing = {
    database: 'databasename',
    user: 'username',
    password: 'password',
    host: 'localhost',
    charset: 'utf8mb4',
};

const production = {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || 'localhost',
    charset: 'utf8mb4',
};

module.exports = {
    development,
    testing,
    production,
};
