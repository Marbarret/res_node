const authService = require('../service/authService');
const CustomError = require('../utils/CustomError');

const login = async (req, res, next) => {
    const { document, password } = req.body;
    try {
        if (!document || !password) {
            return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
        }
        const payload = await authService.validateCredentials(req.dbClient, document, password);
        if (!payload) {
            throw new CustomError('Credenciais inválidas.', 401);
        }
        const token = authService.generateToken(payload);
        return res.status(200).json({ token });    
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login
};
