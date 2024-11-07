const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow');

router.get('/test-follow', followController.testFollow);

module.exports = router;