const env2 = require('env2');
const path = require('path');
const DEFAULT_ENV = 'development';
env2(path.join(process.cwd(),`../env/.env.${process.env.NODE_ENV || DEFAULT_ENV}`));

const {env} = process;

const config = {
  host: env.HOST,
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
  wxAppid: env.WX_APP_ID,
  wxSecret: env.WX_SECRET,
};

module.exports = config;