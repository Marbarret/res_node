const { client } = require('../data/db');

const dbMiddleware = async (req, res, next) => {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
        }

        if (req.path.startsWith('/users')) {
            req.dbClient = client.db('users');
        } else if (req.path.match(/^\/[0-9]+\/dependents/)) {
            req.dbClient = client.db('users');
        } else {
            req.dbClient = client;
        }
        next();
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        next(err);
    }
};

module.exports = dbMiddleware;
