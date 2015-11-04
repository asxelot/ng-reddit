angular
  .module('ngReddit')

  .filter('pluralize', function() {
    // {{post.comments.length + ' комментари(й,я,ев)' | pluralize}}

    return function(s) {
      var n = '' + parseInt(s),
          last = n.slice(-1)

      return s.replace(/\(([^)]+)\)/, function(m) {
        m = m.slice(1, -1).split(',')

        if (n.slice(-2, -1) == 1 || last > 4 || last === '0')
          return m[2]
        else if (last == 1)
          return m[0]
        else
          return m[1]
      })
    }
  })

  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow()
    }
  })

  .filter('md', function($sce) { 
    return function(text) {
      return $sce.trustAsHtml(markdown.toHTML(text || ''))
    }
  })

  .filter('hostname', function() {
    return function(link) {
      if (!link) return 'self'
      var a = document.createElement('a')
      a.href = link
      return a.hostname
    }
  })