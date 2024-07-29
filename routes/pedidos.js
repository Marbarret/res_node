const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Rota GET de pedido'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Rota POST de pedido'
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