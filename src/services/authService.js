const { getCollectionDB } = require('../data/db');

const getUserByEmail = async (dbClient, email) => {
    const collection = getCollectionDB(dbClient, 'users', 'usuario');
    return await collection.findOne({ email });
};

module.exports = { getUserByEmail };
