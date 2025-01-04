const dependentService = require('../service/dependentService');
const { ObjectId } = require('mongodb');
const CustomError = require('../utils/CustomError');
const message = require('../utils/message');

const listDependents = async (req, res, next) => {
    const document = req.params.document;
    try {
        const dependents = await dependentService.getDependentsByDocument(req.dbClient, document);
        if (!dependents) {
            throw new CustomError(message.error.FIND_USER_ERROR, 404);
        }
        return res.status(200).json({ dependents });
    } catch (error) {
        next(error);
    }
};

const addDependent = async (req, res, next) => {
    const document = req.params.document;
    const newDependent = req.body;
    try {
        const result = await dependentService.addDependent(
            req.dbClient, document, newDependent
        );
        if (!result.modifiedCount > 0) {
            throw new CustomError(message.error.FIND_USER_ERROR, 404);
        } 
        return res.status(201).json({ message: message.success.DEPENDENT_ADD });
    } catch (error) {
        next(error);
    }
};

const updateDependent = async (req, res, next) => {
    const { document } = req.params;
    const { dependentId, updatedData } = req.body;
    try {
        const result = await dependentService.updateDependent(req.dbClient, document, dependentId, updatedData);
        if (result.modifiedCount === 0) {
            throw new CustomError(message.error.ERROR_DEPENDENT_UPDATE, 404);
        }
        res.status(200).json({ mensagem: message.success.DEPENDENT_UPDATE });
    } catch (error) {
        console.error(message.error.ERROR_DEPENDENT_UPDATE);
        next(error);
    }
};

const patchDependent = async (req, res, next) => {
    const { document } = req.params;
    const { dependentId } = req.body;
    const partialData = req.body.updatedData;
    try {
        const result = await dependentService.patchDependent(req.dbClient, document, dependentId, partialData);
        if (result.modifiedCount === 0) {
            throw new CustomError(message.error.PARTIAL_DEPENDENT_ERROR, 404);
        }
        res.status(200).json({ mensagem: message.success.DEPENDENT_UPDATE });
    } catch (error) {
        next(error);
    }
};

const deleteDependent = async (req, res, next) => {
    const { document } = req.params;
    const { dependentId } = req.body;
    try {
        const result = await dependentService.deleteDependent(req.dbClient, document, dependentId);
        if (result.modifiedCount === 0) {
            throw new CustomError(message.error.REMOVE_DEPENDENT_ERROR, 404);
        }
        res.status(200).json({ mensagem: message.success.DEPENDENT_DELETE });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listDependents,
    addDependent,
    updateDependent,
    patchDependent,
    deleteDependent
};