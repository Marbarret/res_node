const CustomError = require('../utils/CustomError');
const userService = require('../service/userService');
const bcrypt = require('bcrypt');
const message = require('../utils/message');
const validations = require('../utils/validations');
const emailSender = require('../utils/emailSender');
const helpers = require('../utils/helpers')

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
            return next(new CustomError(message.error.FIND_USER_ERROR, 404));
        }
        return next(new CustomError(message.error.FIND_ALL_USER_ERROR, 500));
    }
};

const createUser = async (req, res) => {
    try {
        const { responsible, password } = req.body;

        if (!responsible || !responsible.fullName || !responsible.email) {
            console.error("Dados obrigatórios ausentes.");
            return res.status(400).json({ mensagem: message.error.RES_REQUIRED_DOCUMENT });
        }

        if (!responsible.email || !/\S+@\S+\.\S+/.test(responsible.email)) {
            console.error("E-mail inválido:", responsible.email);
            return res.status(400).json({ mensagem: message.error.INVALID_EMAIL });
        }

        if (responsible.document?.number) {
            if (!validations.isValidDocument(responsible.document)) {
                console.error("Documento inválido:", responsible.document);
                return res.status(400).json({ mensagem: message.error.INVALID_DOCUMENT });
            }

            const { number } = responsible.document;
            const documentExists = await userService.checkDocumentExists(req.dbClient, number);
            if (documentExists) {
                console.error("Documento já existente:", number);
                return res.status(401).json({ mensagem: message.error.DOC_ALREADY_EXISTS });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        responsible.password = hashedPassword;

        responsible.verification = responsible.verification || {};
        responsible.verification.code = helpers.generateVerificationCode();
        responsible.isVerified = false;

        try {
            await emailSender.sendVerificationEmail(responsible.email, responsible.verification.code);
        } catch (emailError) {
            console.error("Erro ao enviar e-mail:", emailError);
            return res.status(500).json({ mensagem: message.error.EMAIL_NOT_SENT });
        }

        const entity = await userService.createNewUser(req.dbClient, responsible);
        return res.status(201).json({
            mensagem: message.success.USER_CREATED,
            usuario: { id: entity._id, fullName: responsible.fullName, email: responsible.email }
        });

    } catch (error) {
        console.error("Erro inesperado ao criar usuário:", error);
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

const verifyUser = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        if (!email || !verificationCode) {
            return res.status(400).json({ mensagem: message.error.INVALID_EMAIL_AND_CODE });
        }

        const user = await userService.getUserByEmail(req.dbClient, email);
        if (!user) {
            return res.status(404).json({ mensagem: message.error.FIND_USER_ERROR });
        }

        if (user.verification?.code !== verificationCode) {
            return res.status(400).json({ mensagem: message.error.INVALID_VERIFICATION_CODE });
        }

        await userService.verifyUser(req.dbClient, email, verificationCode);

        return res.status(200).json({ mensagem: message.success.VERIFICATION_SUCCESSFUL });
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        return res.status(400).json({ mensagem: message.error.ERROR_VERIFYING_USER });
    }
};

const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ mensagem: message.error.REQUIRED_EMAIL });
        }

        const user = await userService.getUserByEmail(req.dbClient, email);
        if (!user) {
            return res.status(404).json({ mensagem: message.error.FIND_USER_ERROR });
        }

        const newVerificationCode = helpers.generateVerificationCode();
        const updatedUser = await userService.updateVerificationCode(
            req.dbClient, user._id,
            newVerificationCode
        );

        if (!updatedUser) {
            return res.status(500).json({ mensagem: message.error.UPDATE_CODE_FAILURE });
        }

        await emailSender.sendVerificationEmail(email, newVerificationCode);
        return res.status(200).json({ mensagem: message.success.RESEND_SUCCESSFUL });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: message.error.RESEND_CODE_FAILURE });
    }
};

module.exports = {
    getAllUsers,
    getUserByDocument,
    createUser,
    verifyUser,
    updateUser,
    patchUser,
    resendVerificationCode,
    deleteUser
};