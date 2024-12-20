const bcrypt = require('bcrypt');

const saltRound = 10;

const hashPassword = (password) => {
    const salt = bcrypt.genSalt(saltRound);
    return bcrypt.hash(password, salt);
}

const comparePassword = (pass, hashed) => bcrypt.compareSync(pass, hashed)

module.exports = { hashPassword, comparePassword }