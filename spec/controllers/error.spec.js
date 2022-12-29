const errorController = require('../../controllers/error');

describe('Error Controller', () => {
  describe('Get 404', () => {
    let reqSpy;
    let resSpy;
    let statusSpy;

    beforeEach(() => {
      reqSpy = jasmine.createSpy();
      resSpy = jasmine.createSpyObj('res', ['status']);
      statusSpy = jasmine.createSpyObj('status', ['render']);
      resSpy.status.and.returnValue(statusSpy);
    });

    it('should render not found page', () => {
      errorController.get404(reqSpy, resSpy);

      expect(resSpy.status).toHaveBeenCalledOnceWith(404);
      expect(statusSpy.render).toHaveBeenCalledOnceWith('404', {
        pageTitle: 'Page Not Found',
      });
    });
  });
});
