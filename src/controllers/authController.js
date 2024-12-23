const bcrypt = require('bcrypt');
const userService = require('../users/service/userService');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
        }

        const user = await userService.getUserByEmail(req.dbClient, email);
        if (!user) {
            console.error('Usuário não encontrado para o email:', email);
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
        }
    
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
