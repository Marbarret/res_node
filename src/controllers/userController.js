const CustomError = require('../utils/CustomError');
const { hashPassword } = require('../utils/helpers');
const userService = require('../service/userService');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.dbClient);
        if (users.length === 0) {
            console.warn('Nenhum usuário encontrado na base');
        }
        res.status(200).json(users);
    } catch (err) {
        return next(new CustomError('Erro ao buscar usuários', 500));
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

const createUser = async (req, res, next) => {
    try {
        const { responsible, password } = req.body;
        if (!responsible || !responsible.fullName || !responsible.document) {
            return res.status(400).json({ mensagem: 'Dados do responsavel são obrigatórias.' });
        }

        const { document_type, number } = responsible.document;

        if(!['CPF', 'CNPJ'].includes(document_type)) {
            return res.status(400).json({ mensagem: 'O tipo de documento deve ser CPF ou CNPJ.' });
        }

        if ((document_type === 'CPF' && number.length !== 11) || 
            (document_type === 'CNPJ' && number.length !== 14)) {
            return res.status(400).json({ mensagem: `${document_type} deve ter o número correto de caracteres.` });
        }

        const documentExists = await userService.checkDocumentExists(req.dbClient, number);
        if (documentExists) {
            return res.status(401).json({ mensagem: 'Documento já cadastrado.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        responsible.password = hashedPassword;

        const entity = await userService.createNewUser(req.dbClient, responsible);
        return res.status(201).json(entity);
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
        return res.status(500).json({ mensagem: 'Erro ao criar usuário: ' + error.message });
    }
};

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