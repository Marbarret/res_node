const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id_user', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id_curso', userController.updateUser);
router.patch('/:id_curso', userController.patchUser);
router.delete('/:id_curso', userController.deleteUser);

module.exports = router;