const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');
const bcrypt = require('bcrypt');

const getAllUsers = async (dbClient) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    const users = await collection.find({}).toArray();
    return users;
};

const getUserByDocument = async (dbClient, document) => {
    try {
        const db = dbClient.db('users');
        const usuario = await db.collection('usuario').findOne({ document: document });
        return usuario;
    } catch (error) {
        throw new Error('Erro ao buscar usuário: ' + error.message);
    }
};

const createNewUser = async (dbClient, newUser) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    // const saltRounds = 10;
    // newUser.password = await bcrypt.hash(newUser.password, saltRounds)
    const result = await collection.insertOne(newUser);
    return result.ops ? result.ops[0] : newUser;
};

const updateUser = async (dbClient, id, atualizacao) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    return await collection.replaceOne({ _id: new ObjectId(id) }, atualizacao);
};

const patchUser = async (dbClient, id, atualizacaoParcial) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    return await collection.updateOne({ _id: new ObjectId(id) }, { $set: atualizacaoParcial });
};

const deleteUser = async (dbClient, id) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    return await collection.deleteOne({ _id: new ObjectId(id) });
};

module.exports = {
    getAllUsers,
    getUserByDocument,
    createNewUser,
    updateUser,
    patchUser,
    deleteUser
};
