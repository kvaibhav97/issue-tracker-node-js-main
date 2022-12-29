const express = require('express');

const issuesController = require('../controllers/issues');

const router = express.Router();

router.patch('/:id/status', issuesController.updateIssueStatus);

module.exports = router;
