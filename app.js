const express = require('express');
const app = express();

const rotaProdutos = require('./routes/produtos');
const rotaPedido = require('./routes/pedidos');

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaProdutos);

module.exports = app;
