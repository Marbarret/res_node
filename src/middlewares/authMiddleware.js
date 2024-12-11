const authService = require('../services/authService');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Formato esperado: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido.' });
    }

    try {
        const decoded = authService.verifyToken(token);
        req.user = decoded; // Adiciona os dados do token à requisição
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: error.message });
    }
};

module.exports = {
    authenticateToken
};
