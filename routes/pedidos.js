const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Rota GET de pedidos'
    });
});

router.post('/', (req, res, next) => {

    const pedido = {
        numero_pedido: req.body.numero_pedido,
        quantidade: req.body.quantidade
    }

    res.status(201).send({
        mensagem: 'Rota POST de pedido',
        novoPedido: pedido
    });
});

router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Rota DELETE de pedido'
    });
});

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    res.status(200).send({
        mensagem: 'Detalhes de um pedido especial',
        id: id
    });
});

module.exports = router;