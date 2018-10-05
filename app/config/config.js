const env2 = require('env2');
const path = require('path');
const DEFAULT_ENV = 'development';
env2(path.join(process.cwd(),`../env/.env.${process.env.NODE_ENV || DEFAULT_ENV}`));

const {env} = process;

module.exports = {
  development: {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DB_NAME,
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    dialect: 'mysql',
    operatorsAliases: false,
  },
  production: {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DB_NAME,
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    dialect: 'mysql',
    operatorsAliases: false,
  },
};