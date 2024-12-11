const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
        }

        const user = await userService.getUserByEmail(req.dbClient, email);
        console.log(user);

        if (!user) {
            console.error('Usuário não encontrado para o email:', email);
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        console.log('Senha válida:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
        }

        console.log(user.senha);

    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao realizar login:', error.message);
        return res.status(500).json({ mensagem: 'Erro ao realizar login: ' + error.message });
    }
};


module.exports = {
    login
};
