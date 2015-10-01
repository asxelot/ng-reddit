describe('Subreddit page', function() {
  var url = 'http://localhost:8080/r/angularjs'

  beforeEach(function() {
    browser.get(url)
  })

  function login(mail, pass) {
    browser.get('http://localhost:8080/login')
    element(by.model('newUser.email')).sendKeys(mail)
    element(by.model('newUser.password')).sendKeys(pass)
    $('button[type="submit"]').click()
  }
})