const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { connectToDatabase, client } = require('./src/data/db');

const userRoute = require('./src/users/route/userRoute');
const authRoute = require('./src/authetication/route/authRoute');
const dependentRoute = require('./src/dependent/route/dependent');
const authRoutes = require('./src/authetication/route/authRoute');
const protectedRoutes = require('./src/authetication/route/protectedRoute');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});

app.use(async (req, res, next) => {
    try {
        req.dbClient = client;
        next();
    } catch (err) {
        next(err);
    }
});

app.use('/users', userRoute);
app.use('/login', authRoute);
app.use(dependentRoute);
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);

app.use((req, res, next) => {
    const erro = new Error('Nenhuma rota encontrada');
    erro.status = 404;
    next(erro);
});

app.use(async (req, res, next) => {
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
});

module.exports = app;