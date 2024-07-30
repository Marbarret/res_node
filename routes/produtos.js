const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Rota GET de produtos'
    });
});

router.post('/', (req, res, next) => {

    const produto = {
        nome: req.body.nome,
        descricao: req.body.descricao
    }

    res.status(201).send({
        mensagem: 'Rota POST de produtos',
        produtoNovo: produto
    });
});

router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Rota PATCH de produtos'
    });
});

router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Rota DELETE de produtos'
    });
});

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    if (id == 'especial'){
        res.status(200).send({
            mensagem: 'Detalhes de um produto especial',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'Detalhes de um produtos',
            id: id
        });
    }
});


module.exports = router;