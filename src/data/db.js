const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.urlMongo;
const client = new MongoClient(uri, {
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

const ensureUniqueIndex = async (dbClient) => {
  const collection = getCollectionDB(dbClient, 'users', 'usuario');
  await collection.createIndex({ 'responsavel.cpf': 1 }, { unique: true });
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
  ensureUniqueIndex,
  client
};