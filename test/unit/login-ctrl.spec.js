describe('loginCtrl', function() {
  var ctrl, scope, httpBackend

  beforeEach(module('ngReddit'))

  beforeEach(inject(
    function($controller, $rootScope, $httpBackend) {
      httpBackend = $httpBackend
      scope = $rootScope.$new()
      ctrl = $controller('loginCtrl', {
        $scope: scope
      })
  }))

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should post to /login', function() {
    scope.loggedUser = {
      email: 'foo@bar.com',
      password: '123'
    }

    httpBackend.when('POST', '/api/login')
      .respond(scope.loggedUser)

    scope.login()

    httpBackend.flush()

    expect(scope.user).toEqual(scope.loggedUser)
  })
})