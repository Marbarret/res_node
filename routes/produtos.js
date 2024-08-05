const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const db = req.dbClient.db('curso');
        const collection = db.collection('modulo');
        const cursos = await collection.find({}).toArray();
        if (cursos.length === 0) {
            console.warn('Nenhum produto encontrado na coleção');
        }

        res.status(200).json(cursos);
    } catch (err) {
        console.error('Erro ao buscar cursos:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar Cursos', erro: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const db = req.dbClient.db('curso');
        const collection = db.collection('modulo');

        const novoCurso = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            instrutor: req.body.instrutor,
            duracao: req.body.duracao,
            valor: req.body.valor
        };

        const result = await collection.insertOne(novoCurso);
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
    const id = req.params.id_produto;

    res.status(200).send({
        mensagem: 'Detalhes de um pedido especial',
        id: id
    });
});

module.exports = router;