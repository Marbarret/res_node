const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');

const getAllUsers = async (dbClient) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    const users = await collection.find({}).toArray();
    return users;
};

const checkDocumentExists = async (dbClient, document) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        const user = await collection.findOne({ 'document.number': document });
        return !!user;
    } catch (error) {
        throw new Error('Erro ao verificar CPF: ' + error.message);
    }
};

const getUserByDocument = async (dbClient, document) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        const user = await collection.findOne({ 'document.number': document });
        if (!user) { throw new Error('Usuário não encontrado'); }
        return user;
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        throw err;
    }
};

const createNewUser = async (dbClient, newUser) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    try {
        const result = await collection.insertOne(newUser);
        return result.ops ? result.ops[0] : { message: 'Usuário cadastrado com sucesso' };
    } catch (err) {
        if (err.code === 11000) { throw new Error('CPF já cadastrado'); }
        throw err;
    }
};

const verifyUser = async (dbClient, documentNumber, verificationCode) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    const user = await collection.findOne({ "document.number": documentNumber });

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }

    if (user.verificationCode === verificationCode) {
        await collection.updateOne(
            { "document.number": documentNumber },
            { $set: { isVerified: true }, $unset: { verificationCode: "" } }
        );
        return { mensagem: 'Usuário verificado com sucesso!' };
    } else {
        throw new Error('Código de verificação inválido.');
    }
};

const updateUser = async (dbClient, document, updates) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
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
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        return await collection.updateOne({ 'document.number': document }, { $set: partialAtt });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
    }
};

const deleteUser = async (dbClient, document) => {
    try {
        const collection = getCollectionDB(dbClient, 'users', 'usuario');
        return await collection.deleteOne({ 'document.number': document });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error.message);
    }
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
    verifyUser,
    updateUser,
    patchUser,
    deleteUser,
    checkDocumentExists
};
