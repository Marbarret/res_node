const express = require('express');
const dependentController = require('../controller/dependentController');
const router = express.Router();

router.get('/', dependentController.getDependentsByDocument);
router.post('/', dependentController.addDependent);
router.put('/:dependentId', dependentController.updateDependent);
router.delete('/:dependentId', dependentController.deleteDependent);

module.exports = router;
