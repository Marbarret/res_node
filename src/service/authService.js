const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getCollectionDB } = require('../data/db');

const SECRET_KEY = process.env.JWT_SECRET || 'não configurado';

const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY);
};

const validateCredentials = async (dbClient, document, password) => {
    try {
        console.log("Buscando usuário com documento:", document);

        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        const user = await collection.findOne({ 'document.number': document });
        if(!user) {
            throw new Error('Usuário não encontrado');
        }
        
        if (!user.isVerified) {
            return res.status(403).json({ mensagem: 'Usuário não verificado. Complete o processo de verificação.' });
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
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.log(error.message === 'jwt expired' ? 'Token expirado.' : 'Token Invalido');
    }
};

module.exports = {
    validateCredentials,
    generateToken,
    verifyToken
};
