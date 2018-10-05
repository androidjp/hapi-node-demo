'use strict';

const axios = require('axios');
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('../config');
const GROUP_NAME = 'users';
const decryptData = require('../utils/decrypted-data');

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/createJWT`,
    handler: async (request, reply) => {
      const generateJWT = (jwtInfo) => {
        const payload = {
          userId: jwtInfo.userId,
          exp: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60,
        };
        return JWT.sign(payload, config.jwtSecret);
      };
      reply(generateJWT({
        userId: 1,
      }));
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '测试用户JWT签发',
      auth: false, // 约定此接口不参与JWT用户验证
    },
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/wxLogin`,
    handler: async (request, reply) => {
      const appid = config.wxAppid;// 小程序appId
      const secret = config.wxSecret; // 小程序 appSecret
      const {code, encryptedData, iv} = request.payload;

      // 请求微信平台 获取 session_key
      const response = await axios({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        method: 'GET',
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code',
        },
      });
      // return openid and session_key
      const {openid, session_key: sessionKey} = response.data;
      // base on openid ,查找或者创建一个用户
      const user = await models.users.findOrCreate({
        where: {open_id: openid},
      });
      // decrypt 解码用户信息
      const userInfo = decryptData(encryptedData, iv, sessionKey, appid);
      // update DB user 信息
      await models.users.update({
        nick_name: userInfo.nickName,
        gender: userInfo.gender,
        avatar_url: userInfo.avatarUrl,
        open_id: openid,
        session_key: sessionKey,
      }, {
        where: {open_id: openid},
      });

      // 签发 jwt
      const generateJWT = (jwtInfo) => {
        const payload = {
          userId: jwtInfo.userId,
          exp: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60,
        };
        return JWT.sign(payload, config.jwtSecret);
      };
      reply(generateJWT({
        userId: user[0].id,
      }));
    },
    config: {
      auth: false,
      tags: ['api', GROUP_NAME],
      description: '微信用户登录jwt验证',
      validate: {
        payload: {
          code: Joi.string().required().description('微信用户登录的临时code'),
          encryptedData: Joi.string().required(),
          iv: Joi.string().required().description('微信用户信息iv'),
        },
      },
    },
  },
];