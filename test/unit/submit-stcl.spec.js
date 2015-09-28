describe('submitCtrl', function() {
  var scope, http, location

  beforeEach(module('ngReddit'))
  beforeEach(module('templates')) 

  beforeEach(inject(function($controller, $rootScope, $httpBackend, 
                            $location, $compile, $templateCache) {
    http = $httpBackend

    http.when('GET', 'error-messages')
        .respond($templateCache.get('error-messages'))

    location = $location
    scope = $rootScope.$new()
    $controller('submitCtrl', {  
      $scope: scope,
      $routeParams: { type: 'text' }
    })
    $compile($templateCache.get('views/submit.html'))(scope)
    scope.$digest()

    http.flush()
  })) 
 
  afterEach(function() {
    http.verifyNoOutstandingExpectation()
    http.verifyNoOutstandingRequest()
  })
 
  it('newPost should be empty', function() {
    expect(scope.newPost).toEqual({})
  })

  describe('text post', function() {
    it('form should be invalid', function() {
      expect(scope.newPostForm.$invalid).toBe(true)
    })

    it('should required title', function() {
      expect(scope.newPostForm.title.$valid).toBe(false)

      scope.newPost.title = 'test'
      scope.$apply()

      expect(scope.newPostForm.title.$valid).toBe(true)
    })

    it('form should be valid', function() {
      expect(scope.newPostForm.$valid).toBe(false)

      http.when('GET', '/api/check/r/angularjs').respond(true)

      scope.newPost = {
        title: 'test',
        subreddit: 'angularjs'
      }

      http.flush()

      expect(scope.newPostForm.$valid).toBe(true)      
    })

    it('should redirect after submit', function() {
      var post = {
        _id: '123',
        title: 'title',
        text: 'text',
        subreddit: 'angularjs'
      }

      http.when('GET', '/api/check/r/angularjs').respond(true)
      http.when('POST', '/api/r/angularjs', post).respond(post)
      spyOn(location, 'path')

      scope.newPost = post

      http.flush() 
      scope.submit()  
      http.flush()

      expect(location.path)
        .toHaveBeenCalledWith('/r/angularjs/comments/123')
    })
  })

  describe('link post', function() {
    beforeEach(function() {
      scope.type = 'link'
    })

    it('type should be link', function() {
      expect(scope.type).toBe('link')
    })

    it('URL should be invalid', function() {
      scope.newPost.link = 'google.com'
      scope.$apply()
      expect(scope.newPostForm.link.$valid).toBe(false)
    })

    it('URL should be valid', function() {
      scope.newPost.link = 'http://google.com'
      scope.$apply()
      expect(scope.newPostForm.link.$valid).toBe(true)
    })
  })
})