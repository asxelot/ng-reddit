describe('submitCtrl', function() {
  var ctrl, scope, http

  beforeEach(module('ngReddit'))

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    http = $httpBackend
    scope = $rootScope.$new()
    ctrl = $controller('submitCtrl')
  }))
})