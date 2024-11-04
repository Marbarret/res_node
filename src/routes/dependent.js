const express = require('express');
const dependentController = require('../controllers/dependentController');
const router = express.Router();

router.get('/', dependentController.getDependentsByDocument);
router.post('/', dependentController.addDependent);
router.put('/:dependentId', dependentController.updateDependent);
router.delete('/:dependentId', dependentController.deleteDependent);
// router.get('/:document/dependents', dependentController.listDependents);

module.exports = router;
