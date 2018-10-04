const env2 = require('env2');
if (process.env.NODE_ENV === 'production') {
  env2('./.env.prod');
} else {
  env2('./.env');
}

const {env} = process;

const config = {
  host: env.HOST,
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
};

module.exports = config;