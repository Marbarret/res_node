const express = require('express');
const router = express.Router();
const dependentController = require('../controllers/dependentController');

router.post('/:userId', dependentController.createDependents);

module.exports = router;
