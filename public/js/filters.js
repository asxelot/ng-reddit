app
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
