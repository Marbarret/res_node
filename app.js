const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { connectToDatabase, client } = require('./src/data/db');

const courseRoute = require('./src/routes/course');
const userRoute = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');

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

app.use('/course', courseRoute);
app.use('/users', userRoute);
app.use('/login', authRoute);

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
        req.dbClient = client;

        if (req.path.startsWith('/course')) {
            req.dbClient = client.db('curso');
            console.log('Conectado ao banco de dados curso');
        } else if (req.path.startsWith('/user')) {
            req.dbClient = client.db('users');
            console.log('Conectado ao banco de dados users');
        }

        next();
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        next(err);
    }
});

module.exports = app;