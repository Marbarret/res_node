const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
    try {
        const usuários = await userService.getAllUsers(req.dbClient);
        if (usuários.length === 0) {
            console.warn('Nenhum usuário encontrado na base');
        }
        res.status(200).json(usuários);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar Usuários', erro: err });
    }
};

const getUserById = async (req, res) => {
    const id = req.params.id_usuário;
    try {
        const usuário = await userService.getUserById(req.dbClient, id);
        if (!usuário) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.status(200).json(usuário);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: err });
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            photo: req.body.photo,
            document: req.body.document,
            dependents: req.body.dependents || []
        };

        const result = await userService.createUser(req.dbClient, newUser);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao criar usuário', erro: err });
    }
};

const updateUser = async (req, res) => {
    const id = req.params.id_usuário;
    const atualizacao = req.body;

    try {
        const result = await userService.updateUser(req.dbClient, id, atualizacao);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'usuário não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário', erro: err });
    }
};

const patchUser = async (req, res) => {
    const id = req.params.id_usuário;
    const atualizacaoParcial = req.body;

    try {
        const result = await userService.patchUser(req.dbClient, id, atualizacaoParcial);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'usuário não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário', erro: err });
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id_usuário;
    try {
        const result = await userService.deleteUser(req.dbClient, id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensagem: 'usuário não encontrado' });
        }
        res.status(200).json({ mensagem: 'usuário removido com sucesso' });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao remover usuário', erro: err });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    patchUser,
    deleteUser
};
