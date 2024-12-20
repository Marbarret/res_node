const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'token_teste_login';

const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Token inválido ou expirado.');
    }
};

module.exports = {
    generateToken,
    verifyToken
};
