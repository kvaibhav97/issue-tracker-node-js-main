const Issue = require('../models/issue');

/**
 * Fetches all issues from data storage and renders issue tracker page.
 * @param {Object} req The req object represents the HTTP request and has
 * properties for the request query string, parameters, body, HTTP headers,
 * and so on.
 * @param {Object} res The res object represents the HTTP response that an
 * Express app sends when it gets an HTTP request.
 */
exports.getIssueTracker = async (req, res) => {
  const issues = await Issue.fetchAll();
  res.render('issue-tracker', {
    issues,
    pageTitle: 'Issue Tracker',
  });
};

/**
 * Updates issue status. Reads new status from body and issue id from
 * the request params. Handles error when saving new status is not
 * successful. Sends information with code and error to the client.
 * @param {Object} req The req object represents the HTTP request and has
 * properties for the request query string, parameters, body, HTTP headers,
 * and so on.
 * @param {Object} res The res object represents the HTTP response that an
 * Express app sends when it gets an HTTP request.
 */
exports.updateIssueStatus = async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try {
    await Issue.saveNewStatus(id, body.status);
  } catch (e) {
    res.status(e.code).send(e.errors.join(','));
  } finally {
    res.end();
  }
};
