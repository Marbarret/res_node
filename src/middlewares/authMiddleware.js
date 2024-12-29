const authService = require('../service/authService');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido.' });
    }

    try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error.message);
        const statusCode = error.message === 'Token expirado.' ? 403 : 401;
        return res.status(statusCode).json({ mensagem: error.message });
    }
};

module.exports = {
    authenticateToken
};
