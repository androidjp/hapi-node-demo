'use strict';
const {jwtHeaderDefine} = require('../utils/router-helper');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      console.log(request.auth.credentials);
      reply('hello!!  DDD');
    },
    config: {
      tags: ['api', 'tests'],
      description: 'test test test',
      validate: {
        ...jwtHeaderDefine,
      },
    },
  },
];

