/**
 * Renders not found page when client enters a not recognized url.
 * @param {Object} req The req object represents the HTTP request and has
 * properties for the request query string, parameters, body, HTTP headers,
 * and so on.
 * @param {Object} res The res object represents the HTTP response that an
 * Express app sends when it gets an HTTP request.
 */
exports.get404 = (req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
};
