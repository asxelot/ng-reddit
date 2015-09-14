describe('login page', function() {
  var url = 'http://localhost:8080/login',
      email = element(by.model('loggedUser.email')),
      password = element(by.model('loggedUser.password')),
      submit = $('button[type="submit"]'),
      errors = element.all(by.repeater('error in errors'));

  function login(mail, pass) {
    email.sendKeys(mail);
    password.sendKeys(pass);
    submit.click();
  }

  beforeEach(function() {
    browser.get(url);
  });

  it('should show error "User not found"', function() {
    login('asdfsadf@falkdjfls.com', '1234');

    expect(errors.last().getText()).toBe('User not found');
  });

  it('should show error "Wrong password"', function() {
    login('foo@bar.com', '1234');

    expect(errors.last().getText()).toBe('Wrong password');
  });

  it('should redirect to "/" after login', function() {
    login('foo@bar.com', '123');

    expect(browser.getLocationAbsUrl()).toBe('/');
    expect($('#user').getText()).toBe('foo@bar.com');
  });

  it('should show user email after refresh page', function() {
    expect($('#user').getText()).toBe('foo@bar.com');
  });

  it('should logout', function() {
    $('a[ng-click="logout()"').click();

    expect($('#user').getText()).toBe('');
  });
});