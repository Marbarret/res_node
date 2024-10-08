const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');

const getAllUsers = async (dbClient) => {
    const collection = getCollectionDB(dbClient, 'usuario');
    const users = await collection.find({}).toArray();
    return users;
};

const getUserById = async (dbClient, id) => {
    const collection = getCollectionDB(dbClient, 'usuario');
    return await collection.findOne({ _id: new ObjectId(id) });
};

const createNewUser = async (dbClient, novoCurso) => {
    const collection = getCollectionDB(dbClient, 'usuario');
    return await collection.insertOne(novoCurso);
};

const updateUser = async (dbClient, id, atualizacao) => {
    const collection = getCollectionDB(dbClient, 'usuario');
    return await collection.replaceOne({ _id: new ObjectId(id) }, atualizacao);
};

const patchUser = async (dbClient, id, atualizacaoParcial) => {
    const collection = getCollectionDB(dbClient, 'usuario');
    return await collection.updateOne({ _id: new ObjectId(id) }, { $set: atualizacaoParcial });
};

const deleteUser = async (dbClient, id) => {
    const collection = getCollectionDB(dbClient, 'usuario');
    return await collection.deleteOne({ _id: new ObjectId(id) });
};

module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    updateUser,
    patchUser,
    deleteUser
};
