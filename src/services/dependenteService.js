const { getCollectionDB } = require('../data/db');
const { ObjectId } = require('mongodb');

const addDependent = async (dbClient, userId, dependent) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');

    const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { dependents: dependent } }
    );

    if (result.matchedCount === 0) {
        throw new Error('Usuário não encontrado');
    }

    return result;
};

module.exports = {
    addDependent
};
