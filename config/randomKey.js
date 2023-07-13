const crypto = require('crypto');

const generateRandomKey = () => {
  const key = crypto.randomBytes(32).toString('hex');
  return key;
};

module.exports = generateRandomKey;