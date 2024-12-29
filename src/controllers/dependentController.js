const dependentService = require('../service/dependentService');
const { ObjectId } = require('mongodb');
const CustomError = require('../utils/CustomError');

const listDependents = async (req, res, next) => {
    const document = req.params.document;
    try {
        const dependents = await dependentService.getDependentsByDocument(req.dbClient, document);
        if (!dependents) {
            throw new CustomError('Usuário não encontrado', 404);
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
            throw new CustomError('Usuário não encontrado.', 404);
        } 
        return res.status(201).json({ message: 'Dependente adicionado com sucesso.' });
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
            throw new CustomError('Dependente não encontrado para atualização.', 404);
        }
        res.status(200).json({ mensagem: 'Dependente atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar dependente:', error.message);
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
            throw new CustomError('Dependente não encontrado para atualização parcial.', 404);
        }
        res.status(200).json({ mensagem: 'Dependente atualizado parcialmente com sucesso!' });
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
            throw new CustomError('Dependente não encontrado para remoção.', 404);
        }
        res.status(200).json({ mensagem: 'Dependente removido com sucesso!' });
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