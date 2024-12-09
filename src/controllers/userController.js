const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
    try {
        const usuarios = await userService.getAllUsers(req.dbClient);
        if (usuarios.length === 0) {
            console.warn('Nenhum usuário encontrado na base');
        }
        res.status(200).json(usuarios);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar Usuários', erro: err });
    }
};

const getUserByDocument = async (req, res) => {
    const document = req.params.cpf;
    try {
        const usuario = await userService.getUserByDocument(req.dbClient, document);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.status(200).json(usuario);
    } catch (err) {
        console.error('Erro ao buscar usuário por documento:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro: err.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { responsavel } = req.body;

        if (!responsavel || !responsavel.senha || !responsavel.confirmacao_senha) {
            return res.status(400).json({ mensagem: 'Senha e confirmação de senha são obrigatórias.' });
        }

        if (responsavel.senha !== responsavel.confirmacao_senha) {
            return res.status(400).json({ mensagem: 'As senhas não coincidem.' });
        }

        const cpfExists = await userService.checkCPFExists(req.dbClient, responsavel.cpf);
        if (cpfExists) {
            return res.status(400).json({ mensagem: 'CPF já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(responsavel.senha, 10);

        responsavel.senha = hashedPassword;

        const user = await userService.createNewUser(req.dbClient, responsavel);

        return res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
        return res.status(500).json({ mensagem: 'Erro ao criar usuário: ' + error.message });
    }
};



const updateUser = async (req, res) => {
    const id = req.params.id_usuario;
    const atualizacao = req.body;

    try {
        const result = await userService.updateUser(req.dbClient, id, atualizacao);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário', erro: err.message });
    }
};

const patchUser = async (req, res) => {
    const id = req.params.id_usuario;
    const atualizacaoParcial = req.body;

    try {
        const result = await userService.patchUser(req.dbClient, id, atualizacaoParcial);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Erro ao atualizar usuário parcialmente:', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário', erro: err.message });
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id_usuario;

    try {
        const result = await userService.deleteUser(req.dbClient, id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.status(200).json({ mensagem: 'Usuário removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover usuário:', err);
        res.status(500).json({ mensagem: 'Erro ao remover usuário', erro: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserByDocument,
    createUser,
    updateUser,
    patchUser,
    deleteUser
};
