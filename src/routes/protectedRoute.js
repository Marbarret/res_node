const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/protected', authMiddleware.authenticateToken, (req, res) => {
    res.status(200).json({ mensagem: `Bem-vindo, usuário ${req.user.email}!` });
});

module.exports = router;
