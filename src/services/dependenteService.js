const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');

const getDependentsByDocument = async (dbClient, document) => {
    try {
        const db = dbClient.db('users');
        const user = await db.collection('usuario').findOne({ document });

        if (!user || !user.dependents) {
            return [];
        }

        return user.dependents;
    } catch (error) {
        throw new Error('Erro ao buscar dependentes: ' + error.message);
    }
};

const addDependent = async (dbClient, document, newDependent) => {
    return dbClient.collection('users').updateOne(
        { document },
        { $push: { dependents: newDependent } }
    );
};

const updateDependent = async (dbClient, document, dependentId, updatedData) => {
    return dbClient.collection('users').updateOne(
        { document, "dependents._id": dependentId },
        { $set: { "dependents.$": updatedData } }
    );
};

const deleteDependent = async (dbClient, document, dependentId) => {
    return dbClient.collection('users').updateOne(
        { document },
        { $pull: { dependents: { _id: dependentId } } }
    );
};

module.exports = {
    getDependentsByDocument,
    addDependent,
    updateDependent,
    deleteDependent
};