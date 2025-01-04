const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getCollectionDB } = require('../data/db');
const config = require('../config/config');
const message = require('../utils/message');

const db_name = config.database.collection.users;
const collection_name = config.database.collection.client;

const generateToken = (payload) => {
    return jwt.sign(payload, config.auth.jwtSecret);
};

const validateCredentials = async (dbClient, document, password) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        const user = await collection.findOne({ 'document.number': document });
        if(!user) {
            throw new Error('Usuário não encontrado');
        }
        
        if (!user.isVerified) {
            return res.status(403).json({ mensagem: message.error.USER_INVALID_VERIFICATION });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            throw new Error('Senha invalida');
        }
        const payload = { document: user.document.number, userId: user._id };
        if (!payload.document || !payload.userId) {
            throw new Error('Payload inválido.');
        }
        const token = generateToken(payload);
        return token;
    } catch (error) {
        console.error('Erro ao gerar token');
        throw error;
    }
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.auth.jwtSecret);
    } catch (error) {
        console.log(error.message === 'jwt expired' ? 'Token expirado.' : 'Token Invalido');
    }
};

module.exports = {
    validateCredentials,
    generateToken,
    verifyToken
};
