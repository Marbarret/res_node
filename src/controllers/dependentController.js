const dependenteService = require('../services/dependenteService');

const listDependents = async (req, res) => {
    const { document } = req.params;

    try {
        if (!document) {
            return res.status(400).json({ mensagem: 'Documento do usuário não fornecido' });
        }

        const dependents = await dependentService.getDependentsByDocument(req.dbClient, document);

        if (!dependents) {
            return res.status(404).json({ mensagem: 'Nenhum dependente encontrado para este usuário' });
        }

        res.status(200).json(dependents);
    } catch (error) {
        console.error("Erro ao buscar dependentes:", error);
        res.status(500).json({ mensagem: 'Erro ao buscar dependentes', erro: error.message });
    }
};

const getDependentsByDocument = async (req, res) => {
    try {
        const document = req.params.document;

        if (!document) {
            return res.status(400).json({ mensagem: 'Documento do usuário não fornecido' });
        }
        const dependents = await dependenteService.getDependentsByDocument(req.dbClient, document);

        if (!dependents || dependents.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum dependente encontrado' });
        }

        res.status(200).json(dependents);
    } catch (err) {
        console.error('Erro ao buscar dependentes no serviço:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar dependentes' });
    }
};

const addDependent = async (req, res) => {
    const { document } = req.params;
    const newDependent = req.body;
    try {
        await dependenteService.addDependent(req.dbClient, document, newDependent);
        res.status(201).json({ mensagem: 'Dependente adicionado com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao adicionar dependente', erro: error });
    }
};

const updateDependent = async (req, res) => {
    const { document, dependentId } = req.params;
    const updatedData = req.body;
    try {
        const result = await dependenteService.updateDependent(req.dbClient, document, dependentId, updatedData);
        if (result.modifiedCount === 0) return res.status(404).json({ mensagem: 'Dependente não encontrado.' });
        res.status(200).json({ mensagem: 'Dependente atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar dependente', erro: error });
    }
};

const deleteDependent = async (req, res) => {
    const { document, dependentId } = req.params;
    try {
        const result = await dependenteService.deleteDependent(req.dbClient, document, dependentId);
        if (result.modifiedCount === 0) return res.status(404).json({ mensagem: 'Dependente não encontrado.' });
        res.status(200).json({ mensagem: 'Dependente removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao remover dependente', erro: error });
    }
};

module.exports = {
    getDependentsByDocument,
    addDependent,
    updateDependent,
    deleteDependent,
    listDependents
};
