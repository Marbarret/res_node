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

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const db = req.dbClient.db('curso');
        const collection = db.collection('modulo');

        const result = await collection.delete({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ mensagem: 'Curso não encontrado' });
        }

        res.status(200).json({ mensagem: 'Curso removido com sucesso' });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao remover Curso', erro: err });
    }
});

router.put('/:id_produto', async (req, res, next) => {
    const id = req.params.id_produto;
    const atualizacao = req.body;

    try {
        const db = req.dbClient.db('curso');
        const collection = db.collection('modulo');

        const result = await collection.replaceOne({ _id: new ObjectId(id) }, atualizacao);

        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar produto', erro: err });
    }
});

router.patch('/:id_produto', async (req, res, next) => {
    const id = req.params.id_produto;
    const atualizacao = req.body;

    try {
        const db = req.dbClient.db('curso');
        const collection = db.collection('modulo');

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: atualizacao }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar produto', erro: err });
    }
});


router.get('/:id_produto', async (req, res, next) => {
    const id = req.params.id_produto;

    try {
        const db = req.dbClient.db('sample_airbnb');
        const collection = db.collection('listingsAndReviews');

        const produto = await collection.findOne({ _id: new ObjectId(id) });

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        res.status(200).json(produto);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar produto', erro: err });
    }
});

module.exports = router;