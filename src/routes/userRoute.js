const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authToken = require('../middlewares/authMiddleware');

router.get('/', userController.getAllUsers);
router.get('/:document', userController.getUserByDocument);
router.post('/', userController.createUser);
router.put('/:document', userController.updateUser);
router.patch('/:document', userController.patchUser);
router.delete('/:document', authToken.authenticateToken, userController.deleteUser);

module.exports = router;