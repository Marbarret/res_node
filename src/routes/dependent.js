const express = require('express');
const dependentController = require('../controller/dependentController');
const router = express.Router();

router.get('/users/:document/dependent', dependentController.listDependents);
router.post('/users/:document/dependent', dependentController.addDependent);
router.put('/users/:document/dependent/:dependentId', dependentController.updateDependent);
router.delete('/users/:document/dependent/:dependentId', dependentController.deleteDependent);

module.exports = router;
