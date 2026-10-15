const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');

router.get('/', movementController.getAll);
router.post('/', movementController.create);

module.exports = router;
