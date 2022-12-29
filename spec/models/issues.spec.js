const Issue = require('../../models/issue');
const ServerResponse = require('../../models/server-message');

describe('Issues Model', () => {
  describe('Resolve data response', () => {
    it('should resolve with empty array when error is passed', async () => {
      const resolve = jasmine.createSpy();

      Issue.resolveDataResponse('Error', null, resolve);

      expect(resolve).toHaveBeenCalledOnceWith([]);
    });

    it('should resolve with parsed data when there is no error', () => {
      const resolve = jasmine.createSpy();

      Issue.resolveDataResponse(
        null,
        '[{"id": "id", "title": "test", "description": "test", "status": "open"}]',
        resolve
      );

      expect(resolve).toHaveBeenCalledWith([
        {
          id: 'id',
          title: 'test',
          description: 'test',
          status: Issue.STATUS.OPEN,
        },
      ]);
    });
  });

  describe('Fetch all', () => {
    it('should get issues from file', async () => {
      const expectedIssues = [
        {
          id: 'id',
          title: 'test',
          description: 'test',
          status: Issue.STATUS.CLOSED,
        },
      ];
      spyOn(Issue, 'getIssuesFromFile').and.returnValue(expectedIssues);

      expect(await Issue.fetchAll()).toEqual(expectedIssues);
    });
  });

  describe('Get index', () => {
    it('should get index when item of provided id exists in issues', async () => {
      const issues = [
        {
          id: 'id',
          title: 'test',
          description: 'test',
          status: Issue.STATUS.CLOSED,
        },
      ];

      expect(Issue.getIndex('id', issues)).toEqual(0);
    });

    it("should get nexgative index when item of provided id doesn't exists in issues", async () => {
      const issues = [
        {
          id: 'some-id',
          title: 'test',
          description: 'test',
          status: Issue.STATUS.CLOSED,
        },
      ];

      expect(Issue.getIndex('other-id', issues)).toEqual(-1);
    });
  });

  describe('Is valid status change', () => {
    it('should return true when changes from open to pending', () => {
      expect(
        Issue.isValidStatusChange(Issue.STATUS.OPEN, Issue.STATUS.PENDING)
      );
    });

    it('should return true when changes from open to closed', () => {
      expect(Issue.isValidStatusChange(Issue.STATUS.OPEN, Issue.STATUS.CLOSED));
    });

    it('should return true when changes from pending to closed', () => {
      expect(
        Issue.isValidStatusChange(Issue.STATUS.PENDING, Issue.STATUS.CLOSED)
      );
    });

    it('should return false when changes from pending to open', () => {
      expect(
        Issue.isValidStatusChange(Issue.STATUS.PENDING, Issue.STATUS.OPEN)
      );
    });

    it('should return false when changes from closed to open', () => {
      expect(Issue.isValidStatusChange(Issue.STATUS.CLOSED, Issue.STATUS.OPEN));
    });

    it('should return false when changes from closed to pending', () => {
      expect(
        Issue.isValidStatusChange(Issue.STATUS.CLOSED, Issue.STATUS.PENDING)
      );
    });
  });

  describe('Save new status', () => {
    beforeEach(() => {
      spyOn(Issue, 'getIndex');
      spyOn(Issue, 'isValidStatusChange');
      spyOn(Issue, 'getIssuesFromFile');
      spyOn(Issue, 'saveIssues');
    });

    it('should reject when index for the provided id is not found within issues', async () => {
      Issue.getIndex.and.returnValue(-1);

      await expectAsync(
        Issue.saveNewStatus('some-id', Issue.STATUS.OPEN)
      ).toBeRejectedWith(
        new ServerResponse(
          404,
          ["Issue of id: some-id doesn't exist!"],
          ServerResponse.STATUS.FAILURE
        )
      );
    });

    it('should reject when status change is not valid ', async () => {
      const issue = {
        id: 1,
        title: 'test',
        description: 'test',
        status: Issue.STATUS.CLOSED,
      };
      const newStatus = Issue.STATUS.OPEN;
      Issue.getIndex.and.returnValue(0);
      Issue.getIssuesFromFile.and.returnValue([issue]);
      Issue.isValidStatusChange.and.returnValue(false);

      await expectAsync(Issue.saveNewStatus(1, newStatus)).toBeRejectedWith(
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
    });

    it('should save issues with the issue with updated status', async () => {
      const issue = {
        id: 'some-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.PENDING,
      };
      const otherIssue = {
        id: 'other-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.OPEN,
      };
      const updatedIssue = {
        id: 'some-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.CLOSED,
      };
      const newStatus = Issue.STATUS.CLOSED;
      Issue.getIndex.and.returnValue(0);
      Issue.getIssuesFromFile.and.returnValue([issue, otherIssue]);
      Issue.isValidStatusChange.and.returnValue(true);

      await Issue.saveNewStatus('some-id', newStatus);

      expect(Issue.saveIssues).toHaveBeenCalledOnceWith([
        updatedIssue,
        otherIssue,
      ]);
    });

    it('should reject when saving issues failed', async () => {
      const issue = {
        id: 'some-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.PENDING,
      };
      Issue.getIndex.and.returnValue(0);
      Issue.getIssuesFromFile.and.returnValue([issue]);
      Issue.isValidStatusChange.and.returnValue(true);
      Issue.saveIssues.and.callFake(async () => Promise.reject('Not saved'));

      await expectAsync(
        Issue.saveNewStatus('some-id', Issue.STATUS.CLOSED)
      ).toBeRejectedWith(
        new ServerResponse(422, ['Not saved'], ServerResponse.STATUS.FAILURE)
      );
    });

    it('should resolve with success message', async () => {
      const issue = {
        id: 'some-id',
        title: 'test',
        description: 'test',
        status: Issue.STATUS.CLOSED,
      };
      const newStatus = Issue.STATUS.OPEN;
      Issue.getIndex.and.returnValue(0);
      Issue.getIssuesFromFile.and.returnValue([issue]);
      Issue.isValidStatusChange.and.returnValue(true);
      Issue.saveIssues.and.callFake(async () => Promise.resolve());

      await expectAsync(Issue.saveNewStatus(1, newStatus)).toBeResolvedTo(
        new ServerResponse(200, [], ServerResponse.STATUS.SUCCESS)
      );
    });
  });
});
