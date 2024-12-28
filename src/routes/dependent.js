const express = require('express');
const dependentController = require('../controllers/dependentController');
const router = express.Router();

router.get('/users/:document/dependents', dependentController.listDependents);
router.post('/users/:document/dependents', dependentController.addDependent);
router.put('/users/:document/dependents', dependentController.updateDependent);
router.delete('/users/:document/dependents', dependentController.deleteDependent);
router.patch('/users/:document/dependents', dependentController.patchDependent);

module.exports = router;
