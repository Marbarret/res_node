const dependenteService = require('../services/dependenteService');

const createDependents = async (req, res) => {
    try {
        const userId = req.params.userId;
        const newDependent = {
            name: req.body.name,
            age: req.body.age,
            route: req.body.route,
            photo: req.body.photo,
            shift: req.body.shift
        };

        const result = await dependenteService.addDependent(req.dbClient, userId, newDependent);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao criar dependente', erro: err });
    }
};

module.exports = {
    createDependents
};