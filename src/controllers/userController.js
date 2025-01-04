const CustomError = require('../utils/CustomError');
const userService = require('../service/userService');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const message = require('../utils/message');
const validations = require('../utils/validations');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.dbClient);
        if (users.length === 0) {
            console.warn(message.error.FIND_USER_ERROR);
        }
        res.status(200).json(users);
    } catch (err) {
        return next(new CustomError(message.error.FIND_ALL_USER_ERROR, 500));
    }
};

const getUserByDocument = async (req, res) => {
    const document = req.params.document;
    try {
        const user = await userService.getUserByDocument(req.dbClient, document);
        if (!user) {
            return res.status(404).json({ mensagem: message.error.FIND_USER_ERROR });
        }
        res.status(200).json(user);
    } catch (err) {
        if (err.message === message.error.FIND_USER_ERROR) {
            return res.status(404).json({ mensagem: message.error.FIND_USER_ERROR });
        }
        res.status(500).json({ mensagem: message.error.FIND_USER_ERROR });
    }
};

const createUser = async (req, res, next) => {
    try {
        const { responsible, password } = req.body;
        if (!responsible || !responsible.fullName || !responsible.document) {
            return res.status(400).json({ mensagem: message.error.RES_REQUIRED_DOCUMENT });
        }
        const { number } = responsible.document;
        if(!validations.isValidDocument(responsible.document)) {
            return res.status(400).json({ mensagem: message.error.INVALID_DOCUMENT });
        }

        const documentExists = await userService.checkDocumentExists(req.dbClient, number);
        if (documentExists) {
            return res.status(401).json({ mensagem: message.error.DOC_ALREADY_EXISTS });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        responsible.password = hashedPassword;

        responsible.verificationCode = crypto.randomInt(1000, 9999).toString();
        responsible.isVerified = false;

        console.log(message.success.USER_VERIFICATION_CODE(responsible.verificationCode));
        const entity = await userService.createNewUser(req.dbClient, responsible);
        return res.status(201).json(entity);
    } catch (error) {
        return res.status(500).json({ mensagem: message.error.ERROR_CREATED_USER });
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
            return res.status(400).json({ mensagem: message.error.NO_CHANGE });
        }

        const result = await userService.updateUser(req.dbClient, document, fieldsToUpdate);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: message.error.FIND_USER_ERROR });
        }

        res.status(200).json({ mensagem: message.success.USER_UPDATE });
    } catch (err) {
        res.status(500).json({ mensagem: message.error.UPDATE_USER_ERROR });
    }
};

const patchUser = async (req, res) => {
    const document = req.params.document;
    const partialAtt = req.body;
    try {
        const result = await userService.patchUser(req.dbClient, document, partialAtt);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: message.error.FIND_USER_ERROR });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: message.error.PARTIAL_UPDATE_ERROR });
    }
};

const deleteUser = async (req, res) => {
    const document = req.params.document;
    try {
        const result = await userService.deleteUser(req.dbClient, document);
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensagem: message.error.FIND_USER_ERROR });
        }
        res.status(200).json({ mensagem: message.success.USER_REMOVE_SUCCESSFUL });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao remover usuário', erro: err.message });
    }
};

const verifyUser = async (req, res, next) => {
    try {
        const { documentNumber, verificationCode } = req.body;
        if (!documentNumber || !verificationCode) {
            return res.status(400).json({ mensagem: message.error.INVALID_CODE_DOCUMENT });
        }

        const user = await userService.getUserByDocument(req.dbClient, documentNumber);
        if (!user) {
            return res.status(404).json({ mensagem: message.error.FIND_USER_ERROR });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ mensagem: message.error.INVALID_VERIFICATION_CODE });
        }
        await userService.updateUser(req.dbClient, documentNumber, { isVerified: true });
        return res.status(200).json({ mensagem:  message.success.VERIFICATION_SUCCESSFUL });
    } catch (error) {
        return res.status(400).json({ mensagem: message.error.ERROR_VERIFYING_USER });
    }
};

module.exports = {
    getAllUsers,
    getUserByDocument,
    createUser,
    verifyUser,
    updateUser,
    patchUser,
    deleteUser
};