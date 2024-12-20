const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');

const getDependentsByDocument = async (dbClient, document) => {
    try {
        const user = await dbClient
            .db('users')
            .collection('usuario')
            .findOne({ document });
        if (!user || !user.dependent) {
            return [];
        }

        return user.dependent;
    } catch (error) {
        console.error('Erro ao buscar dependentes:', error.message);
        throw new Error('Erro ao buscar dependentes');
    }
};

const addDependent = async (dbClient, document, newDependent) => {
    try {
        const user = await dbClient
            .db('users')
            .collection('usuario')
            .findOne({ document });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const newDependentWithId = {
            ...newDependent,
            _id: new ObjectId()
        };

        const updatedUser = await dbClient
            .db('users')
            .collection('usuario')
            .updateOne(
                { document },
                { $push: { dependent: newDependentWithId } }
            );

        return updatedUser;
    } catch (error) {
        console.error('Erro ao adicionar dependente:', error.message);
        throw new Error('Erro ao adicionar dependente');
    }
};

const updateDependent = async (dbClient, document, dependentId, updatedData) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        return await collection.updateOne(
            { "responsible.document": document, "dependent._id": new ObjectId(dependentId) },
            { $set: { "dependent.$": updatedData } }
        );
    } catch (error) {
        console.error('Erro ao atualizar dependente:', error.message);
        throw new Error('Erro ao atualizar dependente');
    }
};

const deleteDependent = async (dbClient, document, dependentId) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        return await collection.updateOne(
            { document },
            { $pull: { dependent: { _id: new ObjectId(dependentId) } } }
        );
    } catch (error) {
        console.error('Erro ao remover dependente:', error.message);
        throw new Error('Erro ao remover dependente');
    }
};

module.exports = {
    getDependentsByDocument,
    addDependent,
    updateDependent,
    deleteDependent
};
