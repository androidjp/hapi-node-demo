'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const configs = require('../config/config.js');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = {
  ...configs[env],
  define: {
    underscored: true,
  }
};
const db = {};
let sequelize = null;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    const result = file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    return result;
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;