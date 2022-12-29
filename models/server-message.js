/**
 * Server response.
 * @param {number} code
 * @param {string[]} errors
 * @param {string} status
 */
function ServerResponse(code, errors, status) {
  this.code = code;
  this.errors = errors;
  this.status = status;
}

/**
 * Server response status.
 */
ServerResponse.STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
};

module.exports = ServerResponse;
