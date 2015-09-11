describe('Unit: mainCtrl', function() {
  var ctrl, scope;

  beforeEach(module('ngReddit'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('mainCtrl', { $scope: scope });
  }));

  it('$scope.title should be a "Home"', function() {
    expect(scope.title).toEqual('Home');
  });
});