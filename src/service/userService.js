const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');
const config = require('../config/config');

const db_name = config.database.collection.users;
const collection_name = config.database.collection.client;

const getAllUsers = async (dbClient) => {
    const collection = getCollectionDB(dbClient, db_name, collection_name);
    const users = await collection.find({}).toArray();
    return users;
};

const checkDocumentExists = async (dbClient, document) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        const user = await collection.findOne({ 'document.number': document });
        return !!user;
    } catch (error) {
        throw new Error('Erro ao verificar CPF: ' + error.message);
    }
};

const getUserByDocument = async (dbClient, document) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        const user = await collection.findOne({ 'document.number': document });
        if (!user) { throw new Error('Usuário não encontrado'); }
        return user;
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        throw err;
    }
};

const createNewUser = async (dbClient, newUser) => {
    const collection = getCollectionDB(dbClient, db_name, collection_name);
    try {
        const result = await collection.insertOne(newUser);
        return result.ops ? result.ops[0] : { message: 'Usuário cadastrado com sucesso' };
    } catch (err) {
        if (err.code === 11000) { throw new Error('CPF já cadastrado'); }
        throw err;
    }
};

const verifyUser = async (dbClient, email, verificationCode) => {
    const collection = getCollectionDB(dbClient, db_name, collection_name);
    const user = await collection.findOne({ email });

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }

    if (user.verificationCode === verificationCode) {
        await collection.updateOne(
            { email },
            { $set: { isVerified: true }, $unset: { verificationCode: "" } }
        );
        return { mensagem: 'Usuário verificado com sucesso!' };
    } else {
        throw new Error('Código de verificação inválido.');
    }
};

const updateUser = async (dbClient, document, updates) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        return await collection.updateOne(
            { 'document.number': document},
            { $set: updates }
        );
    } catch (error) {
        throw new Error(`Erro ao atualizar usuário com CPF ${document}: ${error.message}`);
    }
};

const patchUser = async (dbClient, document, partialAtt) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        return await collection.updateOne({ 'document.number': document }, { $set: partialAtt });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
    }
};

const deleteUser = async (dbClient, document) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        return await collection.deleteOne({ 'document.number': document });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error.message);
    }
};

const getUserByEmail = async (dbClient, email) => {
    try {
        const collection = getCollectionDB(dbClient, db_name, collection_name);
        const user = await collection.findOne({ email });
        if (!user) { throw new Error('Email não encontrado'); }
        return user;
    } catch (error) {
        console.error('Email não encontrado', error.message)
    }
};

const updateVerificationCode = async (dbClient, userId, newCode) => {
    const collection = getCollectionDB(dbClient, db_name, collection_name);
    return await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { verificationCode: newCode } },
        { returnDocument: 'after' }
    );
};

module.exports = {
    getAllUsers,
    getUserByDocument,
    getUserByEmail,
    createNewUser,
    verifyUser,
    updateUser,
    patchUser,
    deleteUser,
    updateVerificationCode,
    checkDocumentExists
};
