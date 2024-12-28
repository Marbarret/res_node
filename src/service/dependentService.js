const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');

const getDependentsByDocument = async (dbClient, document) => {
    const cleanedDocument = document.trim();
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    const user = await collection.findOne({
        'document.number': cleanedDocument
    });
    return user ? user.dependent : null;
};

const addDependent = async (dbClient, document, newDependent) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        const user = await collection.findOne({ 'document.number': document });
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
                { 'document.number': document },
                { $push: { dependent: newDependentWithId } }
            );
        console.log(updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Erro ao adicionar dependente:', error.message);
        throw new Error('Erro ao adicionar dependente');
    }
};

const updateDependent = async (dbClient, document, dependentId, updatedData) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        console.log(dependentId, '<= dependentId para atualizar');
        const result = await collection.updateOne(
            { "document.number": document, "dependent._id": new ObjectId(dependentId) },
            { $set: { "dependent.$": updatedData } }
        );
        console.log(result, '<= Resultado da atualização');
        return result;
    } catch (error) {
        console.error('Erro ao atualizar dependente:', error.message);
        throw new Error('Erro ao atualizar dependente');
    }
};

const deleteDependent = async (dbClient, document, dependentId) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        const result = await collection.updateOne(
            { "document.number": document },
            { $pull: { dependent: { _id: new ObjectId(dependentId) } } }
        );
        return result;
    } catch (error) {
        console.error('Erro ao remover dependente:', error.message);
        throw new Error('Erro ao remover dependente');
    }
};

const patchDependent = async (dbClient, document, dependentId, partialData) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        const updateFields = {};

        for (const key in partialData) {
            updateFields[`dependent.$.${key}`] = partialData[key];
        }
        const result = await collection.updateOne(
            { "document.number": document, "dependent._id": new ObjectId(dependentId) },
            { $set: updateFields }
        );
        return result;
    } catch (error) {
        console.error('Erro ao atualizar parcialmente dependente:', error.message);
        throw new Error('Erro ao atualizar parcialmente dependente');
    }
};


module.exports = {
    getDependentsByDocument,
    addDependent,
    updateDependent,
    patchDependent,
    deleteDependent
};
