describe('signup page', function() {
  var url = 'http://localhost:8080/signup',
      username = element(by.model('newUser.username')),
      email = element(by.model('newUser.email')),
      password = element(by.model('newUser.password')),
      confirmPassword = element(by.model('newUser.confirmPassword')),
      submit = $('button[type="submit"]'),
      errors = element.all(by.repeater('error in errors'))

  function signUp(name, mail, pass) {
    username.sendKeys(name)
    email.sendKeys(mail)
    password.sendKeys(pass)
    confirmPassword.sendKeys(pass)
    submit.click()
  }

  beforeEach(function() {
    browser.get(url)
  })

  it('should show error "That username is already taken"', function() {
    signUp('foo', 'fasdifjoasd@fjsaldfjl.com', '1234')

    expect(errors.last().getText())
      .toBe("That username is already taken")
  })

  it('should show error "That email is already taken"', function() {
    signUp('fffuuu', 'foo@bar.com', '1234')

    expect(errors.last().getText())
      .toBe("That email is already taken")
  })
})