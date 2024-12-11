const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');
const bcrypt = require('bcrypt');

const getAllUsers = async (dbClient) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    const users = await collection.find({}).toArray();
    return users;
};

const checkCPFExists = async (dbClient, cpf) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        const user = await collection.findOne({ cpf });
        return !!user;
    } catch (error) {
        throw new Error('Erro ao verificar CPF: ' + error.message);
    }
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
    try {
        const result = await collection.insertOne(newUser);
        return result.ops ? result.ops[0] : newUser;
    } catch (err) {
        if (err.code === 11000) { // Código de erro para duplicidade no MongoDB
            throw new Error('CPF já cadastrado');
        }
        throw err;
    }
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
    deleteUser,
    checkCPFExists
};
