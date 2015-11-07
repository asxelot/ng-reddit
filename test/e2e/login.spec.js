describe('login page', function() {
  var url = 'http://localhost:8080/login',
      email = element(by.model('loggedUser.email')),
      password = element(by.model('loggedUser.password')),
      submit = $('button[type="submit"]'),
      errors = $$('.error'),
      username = $('#user')

  function login(mail, pass) {
    email.sendKeys(mail)
    password.sendKeys(pass)
    submit.click()
  }

  beforeEach(function() {
    browser.get(url)
  })

  it('should show error "User not found"', function() {
    login('asdfsadf@falkdjfls.com', '1234')

    expect(errors.last().getText()).toBe('User not found')
  })

  it('should show error "Wrong password"', function() {
    login('foo@m.com', '1234')

    expect(errors.last().getText()).toBe('Wrong password')
  })

  it('should redirect to "/" after login', function() {
    login('foo@m.com', '123')

    expect(browser.getLocationAbsUrl()).toBe('/')
    expect(username.getText()).toBe('foo')
  })

  it('should show user email after refresh page', function() {
    expect(username.getText()).toBe('foo')
  })

  it('should logout', function() {
    $('a[ng-click="logout()"').click()

    expect(username.getText()).toBe('')
  })
})