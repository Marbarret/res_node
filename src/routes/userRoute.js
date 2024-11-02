const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id_usuario', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id_usuario', userController.updateUser);
router.patch('/:id_usuario', userController.patchUser);
router.delete('/:id_usuario', userController.deleteUser);


module.exports = router;