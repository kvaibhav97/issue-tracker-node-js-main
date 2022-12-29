const express = require('express');

const issuesController = require('../controllers/issues');

const router = express.Router();

router.get('/', issuesController.getIssueTracker);

module.exports = router;
