const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.urlMongo;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const getCollectionDB = (dbClient, collectionName) => {
  const db = dbClient.db('curso');
  return db.collection(collectionName);
};

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log("Conectado ao MongoDB com sucesso!");
  }
  return client;
}

module.exports = {
  getCollectionDB,
  connectToDatabase,
  client
};
