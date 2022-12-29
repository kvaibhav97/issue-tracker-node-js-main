const issuesController = require('../../controllers/issues');
const Issue = require('../../models/issue');
const ServerResponse = require('../../models/server-message');

describe('Issues Controller', () => {
  describe('Get issue tracker', () => {
    let reqSpy;
    let resSpy;

    beforeEach(() => {
      reqSpy = jasmine.createSpy();
      resSpy = jasmine.createSpyObj('res', ['render']);
      spyOn(Issue, 'fetchAll');
    });

    it('should fetch all issues', async () => {
      await issuesController.getIssueTracker(reqSpy, resSpy);

      expect(Issue.fetchAll).toHaveBeenCalledTimes(1);
    });

    it('should render issue-tracker view with fetched issues', async () => {
      const issues = [
        { id: 'some-id', title: 'test', description: 'test', status: 'closed' },
      ];
      Issue.fetchAll.and.returnValue(issues);

      await issuesController.getIssueTracker(reqSpy, resSpy);

      expect(resSpy.render).toHaveBeenCalledOnceWith('issue-tracker', {
        issues,
        pageTitle: 'Issue Tracker',
      });
    });
  });

  describe('Update issue status', () => {
    let reqSpy;
    let resSpy;
    let statusSpy;

    beforeEach(() => {
      reqSpy = jasmine.createSpy();
      resSpy = jasmine.createSpyObj('res', ['status', 'end']);
      statusSpy = jasmine.createSpyObj('status', ['send']);
      resSpy.status.and.returnValue(statusSpy);
      spyOn(Issue, 'saveNewStatus');

      reqSpy.body = { status: 'pending' };
      reqSpy.params = { id: 'some-id' };
    });

    it('should save new status', async () => {
      Issue.saveNewStatus.and.callFake(async () => Promise.resolve());

      await issuesController.updateIssueStatus(reqSpy, resSpy);

      expect(Issue.saveNewStatus).toHaveBeenCalledOnceWith(
        reqSpy.params.id,
        reqSpy.body.status
      );
    });

    it('should send status with code and error string when saving new status failed', async () => {
      Issue.saveNewStatus.and.callFake(async () =>
        Promise.reject(
          new ServerResponse(
            404,
            ['Resource not found'],
            ServerResponse.STATUS.FAILURE
          )
        )
      );

      await issuesController.updateIssueStatus(reqSpy, resSpy);

      expect(resSpy.status).toHaveBeenCalledOnceWith(404);
      expect(statusSpy.send).toHaveBeenCalledOnceWith('Resource not found');
    });

    it('should end the response process', async () => {
      Issue.saveNewStatus.and.callFake(async () => Promise.resolve());

      await issuesController.updateIssueStatus(reqSpy, resSpy);

      expect(resSpy.end).toHaveBeenCalledTimes(1);
    });
  });
});
