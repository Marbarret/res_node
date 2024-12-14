const userService = require('../service/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.dbClient);
        if (users.length === 0) {
            console.warn('Nenhum usuário encontrado na base');
        }
        res.status(200).json(users);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar Usuários', erro: err });
    }
};

const getUserByDocument = async (req, res) => {
    const document = req.params.document;
    try {
        const user = await userService.getUserByDocument(req.dbClient, document);
        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Erro ao buscar usuário por documento:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro: err.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { responsible } = req.body;

        if (!responsible || !responsible.password || !responsible.password_confirm) {
            return res.status(400).json({ mensagem: 'Senha e confirmação de senha são obrigatórias.' });
        }

        if (responsible.password !== responsible.password_confirm) {
            return res.status(400).json({ mensagem: 'As senhas não coincidem.' });
        }

        const cpfExists = await userService.checkDocumentExists(req.dbClient, responsible.document);
        if (cpfExists) {
            return res.status(400).json({ mensagem: 'CPF já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(responsible.password, 10);

        responsible.password = hashedPassword;
        delete responsible.password_confirm;

        const user = await userService.createNewUser(req.dbClient, responsible);
        return res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
        return res.status(500).json({ mensagem: 'Erro ao criar usuário: ' + error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.document;
        const updates = { ...req.body };

        const currentUser = await userService.getUserByDocument(req.dbClient, userId);

        if (!currentUser) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const allowedFields = ['fullName', 'email', 'contact', 'address'];
        const fieldsToUpdate = {};

        allowedFields.forEach((field) => {
            if (updates[field] && updates[field] !== currentUser.responsible[field]) {
                fieldsToUpdate[field] = updates[field];
            }
        });

        if (fieldsToUpdate.password) {
            fieldsToUpdate.password = await bcrypt.hash(fieldsToUpdate.password, 10);
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ mensagem: 'Nenhuma alteração válida foi enviada.' });
        }

        const result = await userService.updateUser(req.dbClient, userId, fieldsToUpdate);

        if (result.modifiedCount > 0) {
            return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
        } else {
            return res.status(200).json({ mensagem: 'Nenhuma modificação foi realizada.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
        return res.status(500).json({ mensagem: 'Erro ao atualizar usuário.' });
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
