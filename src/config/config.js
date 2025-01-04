
const config = {
    app: {
        name: 'Busease',
        port: process.env.PORT || 3000
    },

    database: {
        mongoURI: process.env.URI_MONGO,
        collection: {
            users: 'users',
            client: 'usuario'
        }
    },

    auth: {
        jwtSecret: process.env.JWT_SECRET || 'senhasupersecreta',
        saltRounds: 10
    },

};

module.exports = config;