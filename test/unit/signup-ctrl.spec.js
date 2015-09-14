describe('signupCtrl', function() {
  var ctrl, scope, httpBackend;

  beforeEach(module('ngReddit'));

  beforeEach(inject(
    function($controller, $rootScope, $httpBackend) {
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      ctrl = $controller('signupCtrl', {
        $scope: scope
      });
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should confirm password', function() {
    scope.newUser = {
      email: 'foo@bar.com',
      password: '123',
      confirmPassword: '1234'
    };

    expect(scope.signup()).toBe(false);
  });

  it('should post to /signup', function() {
    scope.newUser = {
      email: 'foo@bar.com',
      password: '123',
      confirmPassword: '123'
    };

    httpBackend.when('POST', '/api/signup')
      .respond(scope.newUser);

    scope.signup();

    httpBackend.flush();

    expect(scope.user).toEqual(scope.newUser);
  });
});