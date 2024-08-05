const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const db = req.dbClient.db('sample_airbnb');
        const collection = db.collection('listingsAndReviews');
        
        // Log para depuração
        console.log('Conectado à coleção:', collection.collectionName);

        const produtos = await collection.find({}).toArray();
        
        // Log para depuração
        console.log('Produtos encontrados:', produtos);

        if (produtos.length === 0) {
            console.warn('Nenhum produto encontrado na coleção');
        }

        res.status(200).json(produtos);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar produtos', erro: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const db = req.dbClient.db('sample_airbnb');
        const collection = db.collection('listingsAndReviews');
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao criar produto', erro: err });
    }
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