describe('home page', function() {
  var url = 'http://localhost:8080/',
      title = element(by.model('newPost.title')),
      link = element(by.model('newPost.link')),
      submit = $('button[type="submit"]'),
      posts = element.all(by.repeater('post in posts')),
      errors = element.all(by.repeater('error in errors'))

  beforeEach(function() {
    browser.get(url)
  })

  it('should not post before login', function() {
    posts.count().then(function(count) {
      title.sendKeys('Test post')
      link.sendKeys('Link')
      submit.click()

      posts.count().then(function(n) {
        expect(count).toBe(n)
      })
    })
  })
})