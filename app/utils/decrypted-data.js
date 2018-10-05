'use strict';

const crypto = require('crypto');

// 封装的 decryptData，用于解码小程序的 encryptData
const decryptData = (encryptedData, iv, sessionKey, appid) => {
  //base64 decode
  const encryptedDataNew = Buffer.from(encryptedData, 'base64');
  const sessionKeyNew = Buffer.from(sessionKey, 'base64');
  const ivNew = Buffer.from(iv, 'base64');

  let decoded = '';
  try {
    // 解密 （算法： aes-128-cbc）
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyNew, ivNew);
    // 自动padding = true
    decipher.setAutoPadding(true);
    decoded = decipher.update(encryptedDataNew, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    decoded = JSON.parse(decoded);
    /// 最终得到解密之后的用户信息
  } catch(e) {
    throw new Error('Illegal Buffer');
  }
  if(decoded.watermark.appid !== appid) {
    throw new Error('Illegal Buffer');
  }
  return decoded;
};

module.exports = decryptData;