const express = require('express');
const app = express();
const morgan = require('morgan');

const rotaProdutos = require('./routes/produtos');
const rotaPedido = require('./routes/pedidos');

app.use(morgan('dev'));

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedido);

app.use((req, res, next) => {
    const erro = new Error('Nenhuma rta encontrada');
    erro.status(404);
    next(erro);
});

module.exports = app;
