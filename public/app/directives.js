angular
  .module('ngReddit')

  .directive('subredditValidator', function($q, $http) {
    function checkSubreddit(val) {
      return $q(function(resolve, reject) {
        $http
          .get('/api/check/r/' + val)
          .success(function(subr) {
            subr ? resolve() : reject()
          })
      })
    }
    
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$asyncValidators.checkSubreddit = checkSubreddit
      }
    }
  })

  .directive('usernameValidator', function($q, $http) {
    function checkUsername(val) {
      return $q(function(resolve, reject) {
        $http
          .get('/api/check/u/' + val)
          .success(function(user) {
            user ? reject() : resolve()
          })
      })
    }

    function invalidUsername(username) {
      return /^[a-zA-Z][a-zA-Z0-9]+$/.test(username)
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$asyncValidators.checkUsername = checkUsername
        ngModel.$validators.invalidUsername = invalidUsername
      }
    }
  })

  .directive('emailValidator', function($q, $http) {
    function checkEmail(val) {
      return $q(function(resolve, reject) {
        $http
          .get('/api/check/email/' + val)
          .success(function(email) {
            email ? reject() : resolve()
          })
      })
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$asyncValidators.checkEmail = checkEmail
      }
    }
  })

  .directive('matchTo', function() {
    return {
      restrict: 'A',
      scope: {
        password: '=matchTo'
      },
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$validators.matchPassword = function(confirmPassword) {
          return scope.password == confirmPassword
        }

        scope.$watch('password', ngModel.$validate)
      }
    }
  })

  .directive('elasticTextarea', function() {
    return {
      restrict: 'A',
      link: function(scope, el) {
        el.on('input', function() {
          el[0].style.height = el[0].scrollHeight + 'px'
        })
      }
    }
  })

  .directive('input', inputDirective)

  .directive('textarea', inputDirective)


function inputDirective() {
  return {
    restrict: 'E',
    require: 'ngModel',
    link: function(scope, el, attrs, ngModel) {
      ngModel.$options = ngModel.$options || {}
      angular.extend(
        ngModel.$options, 
        {allowInvalid: true, updateOnDefault: true}
      )

      scope.$watch(attrs.ngModel, function(val) {
        el[val?'addClass':'removeClass']('ng-not-empty')
      })
    }
  }  
}