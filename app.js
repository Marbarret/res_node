const express = require("express");
const app = express();
const morgan = require('morgan');
const { connectToDatabase, client } = require('./src/data/db');
const cookieParser = require("cookie-parser");
const session = require('express-session');

const passport = require('./src/service/passportConfig');

const userRoute = require('./src/routes/userRoute');
const CustomError = require("./src/utils/CustomError");
const errorController = require("./src/controllers/errorController");
// const authRoute = require('./src/authetication/route/authRoute');
const dependentRoute = require('./src/routes/dependent');
// const authRoutes = require('./src/authetication/route/authRoute');
// const protectedRoutes = require('./src/authetication/route/protectedRoute');

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('hello'));

// Session padrão 
app.use(
    session({
        session: 'imnayeon-yoojeongyeon-hiraimomo-minatozakisana-parkjihyo-minasharon-kimdahyun-sonchaeyoung-choutzuyu',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3000 * 60
        }
    })
);

// app.use(passport.initialize());
// app.use(passport.session());

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

app.use(async (req, res, next) => {
    try {
        req.dbClient = client;
        next();
    } catch (err) {
        next(err);
    }
});

app.use('/users', userRoute);
// app.use('/login', authRoute);
app.use(dependentRoute);
// app.use('/auth', authRoutes);
// app.use('/api', protectedRoutes);

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.send(`Bem-vindo, ${req.user.email}`);
});

app.use((req, res, next) => {
    const erro = new CustomError('Nenhuma rota encontrada', 404);
    next(erro);
});

app.use(errorController);

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