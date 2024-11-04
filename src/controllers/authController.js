const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authService = require('../services/authService');

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await authService.getUserByEmail(req.dbClient, email);
        console.log('Usuário encontrado:', user); 
        if (!user) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

        console.log('Senha fornecida:', password);
        console.log('Hash armazenado:', user.password); 

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Senha válida:', isPasswordValid); 
        if (!isPasswordValid) return res.status(401).json({ mensagem: 'Senha incorreta' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao fazer login', erro: error });
    }
};

module.exports = { login };
