const express = require('express');
const dependentController = require('../controllers/dependentController');
const authToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authToken.authenticateToken);

router.get('/:document/dependents', dependentController.listDependents);
router.post('/:document/dependents', dependentController.addDependent);
router.put('/:document/dependents', dependentController.updateDependent);
router.delete('/:document/dependents', dependentController.deleteDependent);
router.patch('/:document/dependents', dependentController.patchDependent);

module.exports = router;
