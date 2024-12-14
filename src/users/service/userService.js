const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../../data/db');
const bcrypt = require('bcrypt');
const collectionDb = getCollectionDB(dbClient, 'users', 'usuario');

const getAllUsers = async (dbClient) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    const users = await collection.find({}).toArray();
    return users;
};

const checkDocumentExists = async (dbClient, document) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        const user = await collection.findOne({ document });
        return !!user;
    } catch (error) {
        throw new Error('Erro ao verificar CPF: ' + error.message);
    }
};

const getUserByDocument = async (dbClient, document) => {
    try {
        const db = dbClient.db('users');
        const user = await db.collection('usuario').findOne({ 'responsible.document': document });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        return user;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error.message);
        throw new Error('Erro ao buscar usuário: ' + error.message);
    }
};

const createNewUser = async (dbClient, newUser) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    try {
        const result = await collection.insertOne(newUser);
        return result.ops ? result.ops[0] : newUser;
    } catch (err) {
        if (err.code === 11000) {
            throw new Error('CPF já cadastrado');
        }
        throw err;
    }
};

const updateUser = async (dbClient, document, updates) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    const result = await collection.updateOne(
        { 'responsavel.cpf': document },
        { $set: updates },
        { upsert: false }
    );
    if (result.matchedCount === 0) {
        throw new Error('Usuário não encontrado.');
    };
    return result;
};


const patchUser = async (dbClient, id, atualizacaoParcial) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    return await collection.updateOne({ _id: new ObjectId(id) }, { $set: atualizacaoParcial });
};

const deleteUser = async (dbClient, id) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    return await collection.deleteOne({ _id: new ObjectId(id) });
};

const getUserByEmail = async (dbClient, email) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    const user = await collection.findOne({ email: email.trim() });
    return user;
};

module.exports = {
    getAllUsers,
    getUserByDocument,
    getUserByEmail,
    createNewUser,
    updateUser,
    patchUser,
    deleteUser,
    checkDocumentExists
};
