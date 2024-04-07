const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/databaseController');

router.route('/')
    .get(databaseController.connectToDB)

module.exports = router;