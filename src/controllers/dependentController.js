const dependentService = require('../service/dependentService');
const { ObjectId } = require('mongodb');

const listDependents = async (req, res) => {
    const { document } = req.params;
    try {
        const result = await dependentService.getDependentsByDocument(req.dbClient, document);
        if (!result) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.status(200).json({ dependents: result });
    } catch (error) {
        console.error('Erro ao listar dependentes:', error.message);
        return res.status(500).json({ error: 'Erro ao listar dependentes' });
    }
};

const addDependent = async (req, res) => {
    const { document } = req.params;
    const newDependent = req.body;
    try {
        const updatedUser = await dependentService.addDependent(
            req.dbClient, document, newDependent
        );
        console.log(document);
        return res.status(200).json({ message: 'Dependente adicionado com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar dependente:', error.message);
        return res.status(500).json({ error: 'Erro ao adicionar dependente' });
    }
};

const updateDependent = async (req, res) => {
    const { document, dependentId } = req.params;
    const updatedData = req.body;
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

//ajustar rota para remover dependente por ID
const deleteDependent = async (req, res) => {
    const { document } = req.params;
    const { dependentId } = req.body;
    try {
        const result = await dependentService.deleteDependent(req.dbClient, document, dependentId);
        if (result.deletedCount === 0) {
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
    deleteDependent
};