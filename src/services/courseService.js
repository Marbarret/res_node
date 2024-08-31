const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');

const getAllCourses = async (dbClient) => {
    const collection = getCollectionDB(req.dbClient, 'curso', 'modulo');
    return await collection.find({}).toArray();
};

const getCourseById = async (dbClient, id) => {
    const collection = getCollectionDB(req.dbClient, 'curso', 'modulo');
    return await collection.findOne({ _id: new ObjectId(id) });
};

const createCourse = async (dbClient, novoCurso) => {
    const collection = getCollectionDB(req.dbClient, 'curso', 'modulo');
    return await collection.insertOne(novoCurso);
};

const updateCourse = async (dbClient, id, atualizacao) => {
    const collection = getCollectionDB(req.dbClient, 'curso', 'modulo');
    return await collection.replaceOne({ _id: new ObjectId(id) }, atualizacao);
};

const patchCourse = async (dbClient, id, atualizacaoParcial) => {
    const collection = getCollectionDB(req.dbClient, 'curso', 'modulo');
    return await collection.updateOne({ _id: new ObjectId(id) }, { $set: atualizacaoParcial });
};

const deleteCourse = async (dbClient, id) => {
    const collection = getCollectionDB(req.dbClient, 'curso', 'modulo');
    return await collection.deleteOne({ _id: new ObjectId(id) });
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    patchCourse,
    deleteCourse
};
