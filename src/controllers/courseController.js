const courseService = require('../services/courseService');
const Course = require('../models/courseModel');

const getAllCourses = async (req, res) => {
    try {
        const cursos = await courseService.getAllCourses(req.dbClient);
        if (cursos.length === 0) {
            console.warn('Nenhum Curso encontrado na coleção');
        }
        res.status(200).json(cursos);
    } catch (err) {
        console.error('Erro ao buscar cursos:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar Cursos', erro: err });
    }
};

const getCourseById = async (req, res) => {
    const id = req.params.id_curso;
    try {
        const curso = await courseService.getCourseById(req.dbClient, id);
        if (!curso) {
            return res.status(404).json({ mensagem: 'Curso não encontrado' });
        }
        res.status(200).json(curso);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar Curso', erro: err });
    }
};

const createCourse = async (req, res) => {
    try {
        const novoCurso = new Course(req.body);
        novoCurso.validate();
        const cursoPlano = novoCurso.toObject();
        const result = await courseService.createCourse(req.dbClient, cursoPlano);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao criar curso', erro: err });
    }
};

const updateCourse = async (req, res) => {
    const id = req.params.id_curso;
    const atualizacao = req.body;

    try {
        const result = await courseService.updateCourse(req.dbClient, id, atualizacao);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'Curso não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar Curso', erro: err });
    }
};

const patchCourse = async (req, res) => {
    const id = req.params.id_curso;
    const atualizacaoParcial = req.body;

    try {
        const result = await courseService.patchCourse(req.dbClient, id, atualizacaoParcial);
        if (result.matchedCount === 0) {
            return res.status(404).json({ mensagem: 'Curso não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar Curso', erro: err });
    }
};

const deleteCourse = async (req, res) => {
    const id = req.params.id_curso;
    try {
        const result = await courseService.deleteCourse(req.dbClient, id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensagem: 'Curso não encontrado' });
        }
        res.status(200).json({ mensagem: 'Curso removido com sucesso' });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao remover Curso', erro: err });
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
