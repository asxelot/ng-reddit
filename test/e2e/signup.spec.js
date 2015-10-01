describe('signup page', function() {
  var url = 'http://localhost:8080/signup',
      username = element(by.model('newUser.username')),
      email = element(by.model('newUser.email')),
      password = element(by.model('newUser.password')),
      confirmPassword = element(by.model('newUser.confirmPassword')),
      submit = $('button[type="submit"]'),
      errors = element.all(by.repeater('error in errors track by $index'))

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
})