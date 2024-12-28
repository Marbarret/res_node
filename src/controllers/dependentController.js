const dependentService = require('../service/dependentService');
const { ObjectId } = require('mongodb');

const listDependents = async (req, res) => {
    const document = req.params.document;
    try {
        const dependents = await dependentService.getDependentsByDocument(req.dbClient, document);
        if (!dependents) {
            return res.status(404).json({ error: 'Usuário não encontrado ou sem dependentes.' });
        }
        return res.status(200).json({ dependents });
    } catch (error) {
        console.error('Erro ao listar dependentes:', error.message);
        return res.status(500).json({ error: 'Erro ao listar dependentes' });
    }
};

const addDependent = async (req, res) => {
    const document = req.params.document;
    const newDependent = req.body;
    try {
        const updatedUser = await dependentService.addDependent(
            req.dbClient, document, newDependent
        );
        if (updatedUser.modifiedCount > 0) {
            return res.status(201).json({ message: 'Dependente adicionado com sucesso.' });
        } else {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao adicionar dependente:', error.message);
    }
};

const updateDependent = async (req, res) => {
    const { document } = req.params;
    const { dependentId, updatedData } = req.body;
    try {
        const result = await dependentService.updateDependent(req.dbClient, document, dependentId, updatedData);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ mensagem: 'Dependente não encontrado para atualização.' });
        }
        res.status(200).json({ mensagem: 'Dependente atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar dependente:', error.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar dependente', erro: error.message });
    }
};

const patchDependent = async (req, res) => {
    const { document } = req.params;
    const { dependentId } = req.body;
    const partialData = req.body.updatedData;
    try {
        const result = await dependentService.patchDependent(req.dbClient, document, dependentId, partialData);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ mensagem: 'Dependente não encontrado para atualização parcial.' });
        }
        res.status(200).json({ mensagem: 'Dependente atualizado parcialmente com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar parcialmente dependente:', error.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar parcialmente dependente', erro: error.message });
    }
};

const deleteDependent = async (req, res) => {
    const { document } = req.params;
    const { dependentId } = req.body;
    try {
        const result = await dependentService.deleteDependent(req.dbClient, document, dependentId);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ mensagem: 'Dependente não encontrado para remoção.' });
        }
        res.status(200).json({ mensagem: 'Dependente removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover dependente:', error.message);
        res.status(500).json({ mensagem: 'Erro ao remover dependente', erro: error.message });
    }
};

module.exports = {
    listDependents,
    addDependent,
    updateDependent,
    patchDependent,
    deleteDependent
};