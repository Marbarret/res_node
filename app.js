require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('yaml');

const { connectToDatabase, client } = require('./src/data/db');
const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);

const userRoute = require('./src/routes/userRoute');
const CustomError = require("./src/utils/CustomError");
const errorController = require("./src/controllers/errorController");
const authRoute = require('./src/routes/authRoute');
const dependentRoute = require('./src/routes/dependent');
const dbMiddleware = require('./src/middlewares/dbMiddleware');

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use(dbMiddleware);

app.use('/busease-api/v1/bse', userRoute);
app.use('/busease-api/v1/auth', authRoute);
app.use('/busease-api/v1/bse', dependentRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    const erro = new CustomError('Nenhuma rota encontrada', 404);
    next(erro);
});

app.use(errorController);

module.exports = app;