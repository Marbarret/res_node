const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config/config');

const client = new MongoClient(
  config.database.mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const getCollectionDB = (dbClient, dbName, collectionName) => {
  const db = dbClient.db(dbName);
  return db.collection(collectionName);
};

async function connectToDatabase(dbName) {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }
    return client.db(dbName);
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  getCollectionDB,
  client
};