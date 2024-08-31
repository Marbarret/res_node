const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');

const getAllEmpresas = async (dbClient) => {
    const collection = getCollectionDB(dbClient, 'empresa');
    return await collection.find({}).toArray();
};

const getEmpresaById = async (dbClient, id) => {
    const collection = getCollectionDB(dbClient, 'empresa');
    return await collection.findOne({ _id: new ObjectId(id) });
};

const createNewEmpresa = async (dbClient, novoCurso) => {
    const collection = getCollectionDB(dbClient, 'empresa');
    return await collection.insertOne(novoCurso);
};

const updateEmpresa = async (dbClient, id, atualizacao) => {
    const collection = getCollectionDB(dbClient, 'empresa');
    return await collection.replaceOne({ _id: new ObjectId(id) }, atualizacao);
};

const patchEmpresa = async (dbClient, id, atualizacaoParcial) => {
    const collection = getCollectionDB(dbClient, 'empresa');
    return await collection.updateOne({ _id: new ObjectId(id) }, { $set: atualizacaoParcial });
};

const deleteEmpresa = async (dbClient, id) => {
    const collection = getCollectionDB(dbClient, 'empresa');
    return await collection.deleteOne({ _id: new ObjectId(id) });
};

module.exports = {
    getAllEmpresas,
    getEmpresaById,
    createNewEmpresa,
    updateEmpresa,
    patchEmpresa,
    deleteEmpresa
};
