const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

const comparePassword = (pass, hashed) => bcrypt.compareSync(pass, hashed);
const generateVerificationCode = () => crypto.randomInt(1000, 9999).toString();

module.exports = { hashPassword, comparePassword, generateVerificationCode }