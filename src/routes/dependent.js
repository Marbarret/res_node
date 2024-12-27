const express = require('express');
const dependentController = require('../controllers/dependentController');
const router = express.Router();

router.get('/users/:number/dependent', dependentController.listDependents);
router.post('/users/:number/dependents', dependentController.addDependent);
router.put('/users/:number/dependent/:dependentId', dependentController.updateDependent);
router.delete('/users/:number/dependent/:dependentId', dependentController.deleteDependent);

module.exports = router;
