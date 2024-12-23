const CustomError = require('../utils/CustomError');
const { hashPassword } = require('../utils/helpers');
const userService = require('../users/service/userService');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.dbClient);
        if (users.length === 0) {
            console.warn('Nenhum usuário encontrado na base');
        }
        res.status(200).json(users);
    } catch (err) {
        return new CustomError('Erro ao buscar usuários', 500);
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
        if (err.message === 'Usuário não encontrado') {
            return res.status(404).json({ mensagem: err.message });
        }
        console.error('Erro ao buscar usuário por documento:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro: err.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { responsible } = req.body;
        if (!responsible || !responsible.password) {
            return res.status(400).json({ mensagem: 'Senha e confirmação de senha são obrigatórias.' });
        }
        const cpfExists = await userService.checkDocumentExists(req.dbClient, responsible.document);
        if (cpfExists) {
            return res.status(400).json({ mensagem: 'CPF já cadastrado' });
        }
        const hashedPassword = hashPassword(responsible.password);
        responsible.password = hashedPassword;
        const user = await userService.createNewUser(req.dbClient, responsible);
        return res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
        return res.status(500).json({ mensagem: 'Erro ao criar usuário: ' + error.message });
    }
};

//Atualizar essa rota ainda falta algumas verificações
const updateUser = async (req, res) => {
    const document = req.params.document;
    const updates = req.body;

    try {
        const allowedFields = ['fullName', 'email', 'contact', 'password'];
        const fieldsToUpdate = allowedFields.reduce((acc, field) => {
            if (updates[field] && updates[field] !== currentUser[field]) {
                acc[field] = updates[field];
            }
            return acc;
        }, {});

        if (fieldsToUpdate.password) {
            fieldsToUpdate.password = hashPassword(fieldsToUpdate.password);
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ mensagem: 'Nenhuma alteração válida foi enviada.' });
        }

        const result = await userService.updateUser(req.dbClient, document, fieldsToUpdate);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado para atualização.' });
        }

        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.', dados: fieldsToUpdate });
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário.', erro: err.message });
    }
};

const patchUser = async (req, res) => {
    const document = req.params.document;
    const partialAtt = req.body;
    try {
        const result = await userService.patchUser(req.dbClient, document, partialAtt);
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
    const document = req.params.document;
    try {
        const result = await userService.deleteUser(req.dbClient, document);
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