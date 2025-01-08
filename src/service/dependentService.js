const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');
const config = require('../config/config');

const db_name = config.database.collection.users;
const collection_name = config.database.collection.client;

const getDependentsByDocument = async (dbClient, document) => {
    const cleanedDocument = document.trim();
    const collection = getCollectionDB(dbClient, db_name, collection_name);
    const user = await collection.findOne({
        'document.number': cleanedDocument
    });
    return user ? user.dependent : null;
};

const addDependent = async (dbClient, document, newDependent) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        const user = await collection.findOne({ 'document.number': document });
         if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const newDependentWithId = {
            ...newDependent,
            _id: new ObjectId()
        };

        const updatedUser = await dbClient
            .db(db_name)
            .collection(collection_name)
            .updateOne(
                { 'document.number': document },
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
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        console.log(dependentId, '<= dependentId para atualizar');
        const result = await collection.updateOne(
            { "document.number": document, "dependent._id": new ObjectId(dependentId) },
            { $set: { "dependent.$": updatedData } }
        );
        return result;
    } catch (error) {
        console.error('Erro ao atualizar dependente:', error.message);
        throw new Error('Erro ao atualizar dependente');
    }
};

const deleteDependent = async (dbClient, document, dependentId) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
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
        const collection = getCollectionDB(dbClient, db_name, collection_name);
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
