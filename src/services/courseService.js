const { ObjectId } = require('mongodb');
const { getCollectionDB } = require('../data/db');

const getAllCourses = async (db) => {
    const collection = getCollectionDB(db, 'curso', 'modulo');
    console.log('Conectado à coleção modulo no banco curso');
    const cursos = await collection.find({}).toArray();
    console.log('Cursos encontrados:', cursos);
    return cursos;
};

const getCourseById = async (db, id) => {
    const collection = getCollectionDB(db, 'curso', 'modulo');
    return await collection.findOne({ _id: new ObjectId(id) });
};

const createCourse = async (db, novoCurso) => {
    const collection = getCollectionDB(db, 'curso', 'modulo');
    return await collection.insertOne(novoCurso);
};

const updateCourse = async (db, id, atualizacao) => {
    const collection = getCollectionDB(db, 'curso', 'modulo');
    return await collection.replaceOne({ _id: new ObjectId(id) }, atualizacao);
};

const patchCourse = async (db, id, atualizacaoParcial) => {
    const collection = getCollectionDB(db, 'curso', 'modulo');
    return await collection.updateOne({ _id: new ObjectId(id) }, { $set: atualizacaoParcial });
};

const deleteCourse = async (db, id) => {
    const collection = getCollectionDB(db, 'curso', 'modulo');
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
