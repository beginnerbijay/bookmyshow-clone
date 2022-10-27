require('dotenv').config()
var PaytmConfig = {
    mid: process.env.PaytmConfig_mid,
    key: process.env.PaytmConfig_key,
    website: "DEFAULT",
  };
  module.exports.PaytmConfig = PaytmConfig;