const fs = require('fs');
const path = require('path');
const ServerResponse = require('./server-message');

/**
 * Path to system file, which stores issues data. Uses entry point of the
 * application to reach the file.
 */
const dataPath = path.join(
  path.dirname(require.main.filename),
  'data',
  'issues.json'
);

/**
 * Issue object wraps methods relevant to the issues processing.
 */
const Issue = {};

/**
 * Resolves response to read file from file system. If encountered error
 * resolves with an empty array. If data arrives, parses it.
 * @param {Error} err Error from the file reading.
 * @param {string|Buffer} data Data received from file reading.
 * @param {Function} resolve Function resolving a Promise.
 */
Issue.resolveDataResponse = (err, data, resolve) => {
  resolve(err ? [] : JSON.parse(data));
};

/**
 * Reads issues stored in a file from the file system.
 * @returns A Promise with issues.
 */
Issue.getIssuesFromFile = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataPath, (err, data) => {
      Issue.resolveDataResponse(err, data, resolve);
    });
  });
};

/**
 * Fetches all issues.
 * @returns A Promise with issues.
 */
Issue.fetchAll = async () => await Issue.getIssuesFromFile();

/**
 * Checks if issue of provided id exists in the issues array.
 * @param {string} id Id of issue to find.
 * @returns Index of the issue found in the issues array.
 */
Issue.getIndex = (id, issues) => {
  return issues.findIndex((issue) => issue.id === id);
};

const STATUS = {
  OPEN: 'open',
  PENDING: 'pending',
  CLOSED: 'closed',
};

/**
 * Issue status.
 */
Issue.STATUS = STATUS;

/**
 * Checks if status change is valid. Once an issue is pending it cannot be set
 * back to open, similarly if an issue is closed it cannot be set back to
 * pending or open.
 * @param {string} oldStatus
 * @param {string} newStatus
 * @returns A boolean if valid or not.
 */
Issue.isValidStatusChange = (oldStatus, newStatus) => {
  const validChange = {
    [STATUS.OPEN]: [STATUS.PENDING, STATUS.CLOSED],
    [STATUS.PENDING]: [STATUS.CLOSED],
    [STATUS.CLOSED]: [],
  };

  return validChange[oldStatus].includes(newStatus);
};

/**
 * Saves issues to the data storage held in the file system.
 * @param {Object[]} issues - Array of issues.
 * @returns A Promise of the file saving process.
 */
Issue.saveIssues = (issues) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dataPath, JSON.stringify(issues), (err) => {
      reject(err);
    });
    resolve();
  });
};

/**
 * Saves new status by reading existing issues, recognizing if issue of
 * provided id in the array and validating status change flow with
 * requested new status. At each possible occurance rejects with server
 * response.
 * @param {string} id Id of the issue for which status should be changed.
 * @param {string} newStatus New value of the status.
 * @returns A Promise with server response.
 */
Issue.saveNewStatus = async (id, newStatus) => {
  const issues = await Issue.getIssuesFromFile();
  const index = await Issue.getIndex(id, issues);
  if (index === -1) {
    return Promise.reject(
      new ServerResponse(
        404,
        ['Issue of id: ' + id + " doesn't exist!"],
        ServerResponse.STATUS.FAILURE
      )
    );
  }

  const issue = issues[index];
  const isValid = Issue.isValidStatusChange(issue.status, newStatus);

  if (!isValid) {
    return Promise.reject(
      new ServerResponse(
        422,
        [
          'Invalid status change from ' +
            issue.status +
            ' to ' +
            newStatus +
            '!',
        ],
        ServerResponse.STATUS.FAILURE
      )
    );
  }

  issue.status = newStatus;

  try {
    await Issue.saveIssues(issues);
  } catch (e) {
    return Promise.reject(
      new ServerResponse(422, [e], ServerResponse.STATUS.FAILURE)
    );
  }

  return Promise.resolve(
    new ServerResponse(200, [], ServerResponse.STATUS.SUCCESS)
  );
};

module.exports = Issue;
