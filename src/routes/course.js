const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/:id_curso', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id_curso', courseController.updateCourse);
router.patch('/:id_curso', courseController.patchCourse);
router.delete('/:id_curso', courseController.deleteCourse);

module.exports = router;