const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

const generateRandomCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const comparePassword = (pass, hashed) => bcrypt.compareSync(pass, hashed);

module.exports = { hashPassword, comparePassword, generateRandomCode }