describe('signupCtrl', function() {
  var scope, rootScope, http, location, form

  beforeEach(module('ngReddit'))
  beforeEach(module('templates'))

  beforeEach(inject(function($controller, $rootScope, $httpBackend,
                            $location, $compile, $templateCache) {
    http = $httpBackend

    http.when('GET', 'error-messages')
        .respond($templateCache.get('error-messages'))

    location = $location
    rootScope = $rootScope
    scope = $rootScope.$new()
    $controller('signupCtrl', {
      $scope: scope
    })
    $compile($templateCache.get('views/signup.html'))(scope)
    scope.$digest()
    http.flush()
  }))

  afterEach(function() {
    http.verifyNoOutstandingExpectation()
    http.verifyNoOutstandingRequest()
  })  

  it('form should be invalid', function() {
    expect(scope.signupForm.$invalid).toBe(true) 
  })

  describe('username', function() {
    it('async validation', function() {
      http.when('GET', '/api/check/u/foo').respond(false)

      scope.newUser.username = 'foo'
      http.flush()

      expect(scope.signupForm.username.$valid).toBe(true)
    })
    
    describe('pattern validation', function() {
      var invalidUsrnames = ['f', 'fo', '4pda', '---', '_foo_', 'qwertyasdfghj']

      invalidUsrnames.forEach(function(username) {
        it(username + ' should be invalid', function() {
          scope.newUser.username = username

          expect(scope.signupForm.username.$invalid).toBe(true)
        })
      })
    })
  })

  describe('email', function() {
    it('async validation', function() {
      http.when('GET', '/api/check/email/foo@bar.com')
          .respond(false)

      scope.newUser.email = 'foo@bar.com'
      http.flush()

      expect(scope.signupForm.email.$valid).toBe(true)
    })
  })

  describe('password', function() {
    it('should not match with comfirm password', function() {
      scope.newUser = {
        password: '123',
        confirmPassword: '1234'
      }
      scope.$apply()

      expect(scope.signupForm.confirmPassword.$invalid).toBe(true)
    })

    it('should match', function() {
      scope.newUser = {
        password: '123',
        confirmPassword: '123'
      }
      scope.$apply()

      expect(scope.signupForm.confirmPassword.$valid).toBe(true)
    })
  })
})