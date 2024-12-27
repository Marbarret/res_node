const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

const comparePassword = (pass, hashed) => bcrypt.compareSync(pass, hashed)

module.exports = { hashPassword, comparePassword }