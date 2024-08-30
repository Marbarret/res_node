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

const getCourseById = async (req, res) => {
    const id = req.params.id_usuário;
    try {
        const usuário = await userService.getCourseById(req.dbClient, id);
        if (!usuário) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.status(200).json(usuário);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: err });
    }
};

const createCourse = async (req, res) => {
    try {
        const novousuário = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            instrutor: req.body.instrutor,
            duracao: req.body.duracao,
            valor: req.body.valor
        };

        const result = await userService.createCourse(req.dbClient, novousuário);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao criar usuário', erro: err });
    }
};

const updateCourse = async (req, res) => {
    const id = req.params.id_usuário;
    const atualizacao = req.body;

    try {
        const result = await userService.updateCourse(req.dbClient, id, atualizacao);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'usuário não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário', erro: err });
    }
};

const patchCourse = async (req, res) => {
    const id = req.params.id_usuário;
    const atualizacaoParcial = req.body;

    try {
        const result = await userService.patchCourse(req.dbClient, id, atualizacaoParcial);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'usuário não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário', erro: err });
    }
};

const deleteCourse = async (req, res) => {
    const id = req.params.id_usuário;
    try {
        const result = await userService.deleteCourse(req.dbClient, id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensagem: 'usuário não encontrado' });
        }
        res.status(200).json({ mensagem: 'usuário removido com sucesso' });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao remover usuário', erro: err });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    patchCourse,
    deleteCourse
};
